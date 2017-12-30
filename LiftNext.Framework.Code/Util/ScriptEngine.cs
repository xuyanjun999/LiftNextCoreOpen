//
//  Author: SEUNGEE|SG
//  Copyright (c) 2006-now, SEUNGEE Co., Ltd.
//
//  商计科技(杭州)有限公司拥有该代码的全部版权
//  		*www.seungee.com*
// 		*TEL:86-571-56778018*
//
//
using System;
using Jint;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Jint.Parser;
using Jint.Runtime;

namespace LiftNext.Framework.Code.Util
{
    #region 辅助类 
    public class ScriptDBQuery
    {
        public string Name { get; set; }
        public string Op { get; set; }

        public string Value { get; set; }
    }

    public class CalcParamException : Exception
    {
        public CalcParamException(string msgclass, string message, string paramCode, string parentCode, ExceptionLevelEnum level) : base(message)
        {
            ExceptionLevelEnum = level;
            MsgClass = msgclass;
            ParentCode = parentCode;
            ParamCode = paramCode;
        }

        public string ParamCode { get; set; }
        public string ParentCode { get; set; }

        public string MsgClass { get; set; }

        public int ExceptionLevel { get; set; }

        public ExceptionLevelEnum ExceptionLevelEnum
        {
            get { return (ExceptionLevelEnum)ExceptionLevel; }
            set { ExceptionLevel = (int)value; }
        }
    }

    public class CalcParamArgs
    {
        public CalcParamArgs()
        {
            Modify = true;
        }
        public int ParamDefineID { get; set; }
        public string ParamCode { get; set; }
        public string ParamName { get; set; }
        public string DataType { get; set; }
        public string DefaultValue { get; set; }
        public int DigitNum { get; set; }
        public bool Modify { get; set; }
        public bool AllowBlank { get; set; }
        public bool Linkage { get; set; }
    }

    public class CalcParamResult
    {
        public CalcParamResult()
        {
            Success = true;
            IsCouldRemove = true;
        }

        public string ParamCode { get; set; }
        public string ParentCode { get; set; }
        public bool Success { get; set; }

        public string MsgClass { get; set; }

        public object ReturnValue { get; set; }

        public string Message { get; set; }

        public ExceptionLevelEnum ExceptionLevel { get; set; }

        public Exception Exception { get; set; }

        public bool IsCouldRemove { get; set; }
    }

    public enum ExceptionLevelEnum
    {
        NoInput = 0,

        ScriptError = 1,

        NullValue = 2,

        CatchValue = 3,

        CalcBlock = 4
    }
    #endregion

    public class ScriptEngine
	{
        public string EXP_HEADER_TAG = "EX:";
        public string FuncJs { get; set; }
        public ScriptEngine()
        {
            FuncJs = GetJsFuncDefine();
        }
        public string GetJsFuncDefine()
        {
            //PathUtil.WebRootPath
            var jsPath = Path.Combine(PathUtil.WebRootPath, "apps", "func.js");
            if (File.Exists(jsPath))
            {
                return File.ReadAllText(jsPath);
            }
            return string.Empty;
        }

        public CalcParamResult Execute(string paramCode, string script, CalcParamArgs[] codes, Dictionary<string, object> dic)
        {
            CalcParamResult retObj = new CalcParamResult()
            {
                ParamCode = paramCode
            };
           
            try
            {
                var Obj = Execute(script, codes, dic, (code)=> {
                    var calcParamArgs = codes.FirstOrDefault(c => c.ParamCode == code);
                    if(calcParamArgs == null)
                    {
                        //非计算参数，直接返回
                        return string.Format("\"{0}\"", code);
                    }
                    if (!dic.ContainsKey(code))
                    {
                        //return string.Empty;
                        throw new CalcParamException("尚未赋值", string.Format("计算目标[{0}], 参数[{1}]", retObj.ParamCode, code), retObj.ParamCode, code, ExceptionLevelEnum.NoInput);
                    }
                    var obj = dic[code];
                    if (calcParamArgs.DataType == "string")
                    {
                        return string.Format("{0}",obj);
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(obj.ToString()))
                        {
                            double d = 0;
                            if (double.TryParse(obj.ToString(), out d))
                            {
                                return d;
                            }
                            else
                            {
                                return string.Format("{0}", obj);
                            }
                        }
                        return string.Format("{0}", obj);
                    }
                });
                if(Obj == null)
                {
                    throw new CalcParamException("无效参数", string.Format("计算目标[{0}], 值为空", paramCode), paramCode, null, ExceptionLevelEnum.NullValue);
                }
                var calcParam = codes.FirstOrDefault(c => c.ParamCode == paramCode);
                if (calcParam != null && calcParam.DataType == "double")
                {
                    double d = 0;
                    if (double.TryParse(Obj.ToString(), out d))
                    {
                        if (double.IsNaN(d))
                        {
                            throw new CalcParamException("无效参数", string.Format("计算目标[{0}], 值为NaN", paramCode), paramCode, null, ExceptionLevelEnum.NullValue);
                        }
                        if (double.IsInfinity(d))
                        {
                            throw new CalcParamException("无效参数", string.Format("计算目标[{0}], 值为Infinity", paramCode), paramCode, null, ExceptionLevelEnum.NullValue);
                        }
                        retObj.ReturnValue = Math.Round(d, calcParam.DigitNum);
                    }
                    else
                    {
                        retObj.ReturnValue = Obj;
                    }
                }
                else
                {
                    retObj.ReturnValue = Obj;
                }
            }
            catch(CalcParamException exx)
            {
                retObj.Success = false;
                retObj.ParamCode = exx.ParamCode;
                retObj.ParentCode = exx.ParentCode;
                retObj.MsgClass = exx.MsgClass;
                retObj.Message = exx.Message;
                retObj.ExceptionLevel = exx.ExceptionLevelEnum;
            }
            catch(ParserException px)
            {
                retObj.ExceptionLevel = ExceptionLevelEnum.ScriptError;
                retObj.ParamCode = retObj.ParamCode;
                retObj.MsgClass = "语法错误";
                retObj.Message = string.Format("参数[{0}]", retObj.ParamCode);
                retObj.Success = false;
                retObj.Exception = px;
            }
            catch (JavaScriptException jx)
            {
                if (jx.Message.Contains("is not defined"))
                {
                    retObj.ExceptionLevel = ExceptionLevelEnum.NoInput;
                    var pname = jx.Message.Replace(" is not defined", "");
                    retObj.ParentCode = pname;
                    retObj.ParamCode = retObj.ParamCode;
                    retObj.MsgClass = "尚未赋值";
                    retObj.Message = string.Format("计算目标[{0}], 参数[{1}]", retObj.ParamCode, pname);
                }
                else if (jx.Error.ToString().StartsWith("Error:"))
                {
                    retObj.ExceptionLevel = ExceptionLevelEnum.CatchValue;
                    retObj.ParamCode = retObj.ParamCode;
                    retObj.MsgClass = "提示信息";
                    retObj.Message = jx.Error.ToString().Replace("Error:", "");
                }
                else 
                {
                    retObj.ExceptionLevel = ExceptionLevelEnum.ScriptError;
                    retObj.ParamCode = retObj.ParamCode;
                    retObj.MsgClass = "语法错误";
                    retObj.Message = string.Format("参数[{0}]", retObj.ParamCode);
                }
                retObj.Success = false;
                retObj.Exception = jx;
            }
            catch (Exception ex)
            {
                retObj.ExceptionLevel = ExceptionLevelEnum.ScriptError;
                retObj.ParamCode = retObj.ParamCode;
                retObj.MsgClass = "语法错误";
                retObj.Message = string.Format("参数[{0}]", retObj.ParamCode);
                retObj.Success = false;
                retObj.Exception = ex;
            }
            return retObj;
        }

        public bool IsExp(string script)
        {
            script = script.Trim();
            if (script.IndexOf(EXP_HEADER_TAG, StringComparison.OrdinalIgnoreCase) == 0)
            {
                return true;
            }
            return false;
        }

        string FormartExp(string script)
        {
            script = script.Trim();
            if (script.IndexOf(EXP_HEADER_TAG, StringComparison.OrdinalIgnoreCase) == 0)
            {
                script = script.Substring(EXP_HEADER_TAG.Length);
            }
            return script;
        }

        object Execute(string script, CalcParamArgs[] codes, Dictionary<string, object> dic,  Func<string, object> GetVarValueFunc)
		{
            //如果参数值为单单一个参数编号，则不需要加EX:
            if(!codes.Any(c=>c.ParamCode == script || string.Format("[{0}]", c.ParamCode) == script))
            {
                if (!IsExp(script))
                {
                    return script;
                }
                script = FormartExp(script);
            }

            var regex = new Regex("=>");
            script = regex.Replace(script, m =>
            {
                return "?";
            });

            var engine = new Engine();
            if (GetVarValueFunc != null)
            {
                foreach (var vcode in dic.Keys)
                {
                    script = script.Replace(string.Format("[{0}]", vcode), vcode);
                    engine = engine.SetValue(vcode, GetVarValueFunc(vcode));
                }
            }
            var o = engine.Execute(FuncJs + " " + script)
                .GetCompletionValue();

            if(o.IsArray())
            {
                return o.AsArray().ToString();
            }
			return o.ToObject();
		}

        /// <summary>
        /// 处理静态参数
        /// 
        /// </summary>
        /// <param name="script"></param>
        /// <param name="getVaraibleFn"></param>
        /// <returns></returns>
        static string ParseStaticArg(string script, Func<string, object> GetVarValueFunc=null,IList<string> vars=null,string prefix="",string suffix="")
        {
            //var vars = new List<string>();
            var regex = new Regex(@"(\[\w{1,30}\])", RegexOptions.Multiline);
            //var resultScript = script;
            script = regex.Replace(script, m =>
            {
                if (m.Groups.Count > 0)
                {
                    var vcode = m.Groups[1].Value;
                    if (!String.IsNullOrEmpty(vcode))
                    {
                        var code = vcode.Substring(1, vcode.Length - 2);
                        if (vars != null) {
                            if (String.IsNullOrEmpty(vars.FirstOrDefault(vv => vv == code)))
                            {
                                vars.Add(code);
                            }
                        }
                        if (GetVarValueFunc != null) {
                            var o = GetVarValueFunc(code);
                            if (o != null)
                            {
                                code = String.Format("{0}{1}{2}", prefix, o, suffix);
                            }
                            else {
                                code = "";
                            }
                        }
                        return code;
                    }
                    return vcode;
                }
                return m.Value;
            });
            return script;
        }

        /// <summary>
        /// 处理数据库函数
        ///     语法：条件使用AND关联 
        ///         "图纸参数表","参数7","",{图号:"YKHM0201Z",变量名:"LA",参数1:DBSCOPE([DLS]),参数2:[WG]}
        ///      语法：条件使用OR关联
        ///          "图纸参数表","参数7","",OR{图号:"YKHM0201Z",变量名:"LA",参数1:DBSCOPE([DLS]),参数2:[WG]}
        ///      语法：条件使用否条件!
        ///         "图纸参数表","参数7","",OR{图号:"YKHM0201Z",变量名:!%"LA%",参数1:DBSCOPE([DLS]),参数2:[WG]}
        ///     1>=A>=0
        /// </summary>
        /// <param name="script"></param>
        /// <returns></returns>
        static object ParseDBArg(string script,Func<string,object> GetValValueFunc=null)
        {
            var result = "";
            //"图纸参数表","参数7","",{图号:"YKHM0201Z",变量名:"LA",参数1:DBSCOPE([DLS]),参数2:[WG]}
            //"图纸参数表","参数7","",OR{图号:"YKHM0201Z",变量名:"LA",参数1:DBSCOPE([DLS]),参数2:[WG]}
            ////"图纸参数表","参数7","",{图号:!"YKHM0201Z",变量名:"LA",参数1:DBSCOPE([DLS]),参数2:[WG]}
            //{d3}>1 && {d3}<2
            var args = script.Split(',');
            var tableName = args[0].Replace(@"""","");
            var argName = args[1].Replace(@"""","");
            var defaultValue = args[2];
            var conditionArr = new string[args.Length - 3];
            Array.Copy(args,3,conditionArr,0,args.Length-3);
            var condition = String.Join(",", conditionArr);
          
            var lstFilters = new List<ScriptDBQuery>();
            var lstExFilter = new List<ScriptDBQuery>();
            //Console.WriteLine(condition);

            var isAnd = !(condition.StartsWith("OR{") || condition.StartsWith("or{"));
            //OR{图号:"YKHM0201Z",变量名:"LA",参数1:DBSCOPE([DLS]),参数2:[WG]}
            //OR{图号:"YKHM0201Z",变量名:"LA",参数1:DBSCOPE([DLS]),参数2:[WG]}
            var regex = new Regex(@"[\{,]?(.*?)\:(.*?)[\},]{1}");
            var matches = regex.Matches(condition);
            var where = "";
            //var op = "=";

            foreach (Match match in matches) {
                var op = "=";
                var prefix = "";
                var suffix = "";

                if (match.Groups.Count < 3) continue;
                var mname = match.Groups[1].Value;
                var mvalue = match.Groups[2].Value;

                if (mvalue.StartsWith("!"))
                {
                    op = "!=";
                    mvalue = mvalue.Substring(1);
                }

                if (mname.StartsWith("OR{")) {
                    mname = mname.Substring(3);
                }
                else if (mname.StartsWith("{")) {
                    mname = mname.Substring(1);
                }

                if (mvalue.StartsWith("DBSCOPE"))
                {
                    //DBSCOPE([DLS])
                    var reg = new Regex(@"DBSCOPE\(.*?\)");
                    var dbmatch = reg.Match(mvalue);
                    if (dbmatch != null) {
                        var exValue = dbmatch.Groups[1].Value;
                        //dicExtendWhere.Add(mname, mvalue);
                        lstExFilter.Add(new ScriptDBQuery
                        {
                            Name=mname,
                            Value=exValue,
                            Op=op
                        });
                        continue;
                    }
                }
                else if (mvalue.StartsWith("DBLIKE"))
                { 
                  
                    //DBLIKE([ABC])
                    //DBLIKELEFT([ABC])
                    //DBLIKERIGHT([ABC])
                    //参数2:DBLIKELEFT([WG])
                    var reg = new Regex(@"DBLIKE(LEFT)?(RIGHT)?\((.*?)\)");
                    var likematch = reg.Match(mvalue);
                    if (likematch != null)
                    {
                        var exValue = likematch.Groups[3].Value;
                        Console.WriteLine("LIKE MATCH IS OK:{0}", exValue);
                        if (mvalue.StartsWith("DBLIKELEFT"))
                        {
                            op = "%L";
                        }
                        else if (mvalue.StartsWith("DBLIKERIGHT"))
                        {
                            op="%R";
                        }
                        else {
                            op = "%";
                        }
                        mvalue = exValue;
                    }

                }

                lstFilters.Add(new ScriptDBQuery
                {
                    Name=mname,
                    Value=mvalue,
                    Op=op
                });
                continue;

                if (where.Length > 0) {
                    where += isAnd == true ? " and " : " or ";
                }

                
                if (mvalue.StartsWith("!")) {
                    op = "!=";
                    mvalue = mvalue.Substring(1);
                }

                if (mvalue.StartsWith("[")) {
                    mvalue = ParseStaticArg(mvalue, GetValValueFunc,null,prefix,suffix);
                }

                if (mvalue.StartsWith("DBSCOPE")) {
                    mvalue = @"""";
                }

                where += String.Format("{0} {1} {2}", mname,
                    op,
                    mvalue);
                
                //Console.WriteLine("RESULT===={0},{1}",match.Groups[1].Value,match.Groups[2].Value);
            }

            return ExecuteSql(GetValValueFunc,isAnd, tableName, argName, lstFilters, lstExFilter);
            return null;

            var rawSql = String.Format("select {0} from {1} where {2}",
                tableName,
                argName,
                where
                );

            Console.WriteLine(script);
            Console.WriteLine(rawSql);

            //if (session == null) return null;
            //session.r
            
        }


        static object ExecuteSql(Func<string, object> GetValValueFunc,bool isAnd, string tableName, string fieldName, IList<ScriptDBQuery> lstFilters, IList<ScriptDBQuery> lstExFilters)
        {
            //if (session == null) return null;
            var rawSql = String.Format("select {0}", fieldName);
            var hasExFilter = false;
            var where = "";
            if (lstExFilters != null && lstExFilters.Count > 0) {
                //var index = 0;
                hasExFilter = true;
                foreach (var f in lstExFilters) {

                    rawSql += ", " + f.Name;
                }
            }

            rawSql += String.Format(" from {0}", tableName);

            foreach (var f in lstFilters) {
                //Console.WriteLine("{0} {1} {2}", f.Name,f.Op, f.Value);
                if (where.Length > 0) {
                    where += isAnd == true ? " and " : " or ";
                }
                var v = f.Value;
                if (!String.IsNullOrEmpty(v)) {
                    if (v.StartsWith("[") && v.EndsWith("]")) {
                        if (GetValValueFunc != null) {
                            var o = GetValValueFunc(v);
                            if (o != null) {
                                //like process
                                v = o.ToString();
                                if (!String.IsNullOrEmpty(v)) {
                                    if (f.Op == "%")
                                    {
                                        f.Op = "like";
                                        v = v.Substring(1, v.Length - 2);
                                        v = String.Format("\"%{0}%\"", v);
                                    }
                                    else if (f.Op == "%L") {
                                        f.Op = "like";
                                        v = v.Substring(1, v.Length - 2);
                                        v = String.Format("\"%{0}\"", v);
                                    }
                                    else if (f.Op == "%R")
                                    {
                                        f.Op = "like";
                                        v = v.Substring(1, v.Length - 2);
                                        v = String.Format("\"{0}%\"", v);
                                    }
                                }
                                
                            }
                        }
                    }
                }
                where += String.Format("{0} {1} {2}", f.Name, f.Op, v);
            }

            if (!String.IsNullOrEmpty(where)) {
                rawSql += " where " + where;
            }

            Console.WriteLine(rawSql);
            #region execute raw sql command
            try
            {
                //var command = session.Connection.CreateCommand();
                //command.CommandText = rawSql;
                //return command.ExecuteScalar();
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }


            #endregion
        }

        public static void Test()
        {
            var script = @"GETDB(""图纸参数表"",""参数7"","""",{图号:""YKHM0201Z"",变量名:""LA"",参数1:DBSCOPE([DLS]),参数2:[WG]})";

            var script2 = @"""图纸参数表"",""参数7"","""",OR{图号:""YKHM0201Z"",变量名:!""LA"",参数1:DBSCOPE([DLS]),参数2:DBLIKELEFT([WG])}";

            ParseDBArg(script2,(v)=>v);
            //"AB"
            return; 
        }

		public static void Execute(string code)
		{

			var engine = new Engine ();
			var script = "a>b?1000:b>c?99:88";
			var start = DateTime.Now;
			for (var i = 0; i < 10000; i++) {
				var o = engine.SetValue ("a", new Random ().Next (1, 10000))
					.SetValue ("b", new Random ().Next (1, 10000))
					.SetValue ("c", new Random ().Next (1, 10000))
					.Execute (script)
					.GetCompletionValue ()
					.ToObject ();

				Console.WriteLine ("{0} is {1}", i + 1, o);
			}
			//var o = engine.Execute ("1+3+a").GetCompletionValue ().ToObject ();
			Console.WriteLine ((DateTime.Now-start).TotalSeconds);
		}

	}
}

