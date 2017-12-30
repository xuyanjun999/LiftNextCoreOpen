using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Code.Util
{
    public class ReflectionUtil
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public static PropertyInfo GetPropertyInfo(object obj, string propertyName)
        {
            var propertyInfos = obj.GetType().GetProperties();
            foreach (var propertyInfo in propertyInfos)
            {
                if (propertyInfo.Name.ToLower() == propertyName.ToLower()) return propertyInfo;
            }
            return null;
        }




        /// <summary>
        /// 
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public static bool HasPropertyInfo(object obj, string propertyName)
        {
            var propertyInfos = obj.GetType().GetProperties();
            foreach (var propertyInfo in propertyInfos)
            {
                // var cusAttrs = propertyInfo.GetCustomAttributes(typeof(NotMappedAttribute));
                // if (cusAttrs != null && cusAttrs.Count() > 0) continue;
                if (propertyInfo.Name.ToLower() == propertyName.ToLower()) return true;
            }
            return false;
        }

        public static bool HasField(object obj, string fieldName)
        {
            var fields = obj.GetType().GetRuntimeFields();

            return fields.FirstOrDefault(x => x.Name.ToLower() == fieldName.ToLower()) != null;
        }

        public static FieldInfo GetFieldInfo(object obj, string fieldName)
        {
            var fields = obj.GetType().GetRuntimeFields();

            return fields.FirstOrDefault(x => x.Name.ToLower() == fieldName.ToLower());
        }

        public static object GetFieldValue(object obj, string fieldName)
        {
            var fields = obj.GetType().GetRuntimeFields();
            var field = fields.FirstOrDefault(x => x.Name.ToLower() == fieldName.ToLower());
            return field?.GetValue(obj);
        }



        /// <summary>
        /// 
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public static bool HasNotEntityPropertyInfo(object obj, string propertyName)
        {
            var propertyInfos = obj.GetType().GetProperties();
            foreach (var propertyInfo in propertyInfos)
            {
                var cusAttrs = propertyInfo.GetCustomAttributes(typeof(NotMappedAttribute));
                if (cusAttrs != null && cusAttrs.Count() > 0) continue;

                if (propertyInfo.PropertyType.FullName.Contains("LiftNext.Framework.Domain.Entity"))
                {
                    if (!propertyInfo.PropertyType.IsEnum) continue;
                }

                if (propertyInfo.Name.ToLower() == propertyName.ToLower())
                    return true;

            }
            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public static object GetPropertyValue(object obj, string propertyName)
        {
            var propertyInfos = obj.GetType().GetProperties();
            foreach (var propertyInfo in propertyInfos)
            {
                if (propertyInfo.Name.ToLower() == propertyName.ToLower()) return propertyInfo.GetValue(obj);
            }
            return null;
        }

        #region 获取属性的值 包含父级属性
        /// <summary>
        /// 获取属性的描述 例 Student.Teach
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="propertyName">Student.Teacher.Name</param>
        /// <returns></returns>
        public static object GetPropertyValueWithDeep(object obj, string propertyName)
        {
            if (!propertyName.Contains("."))
            {
                return GetPropertyValue(obj, propertyName);
            }
            else
            {
                return GetDeepPropertyValue(obj, propertyName);
            }
        }
        #endregion

        #region 获取属性的值 包含父级属性
        static object GetDeepPropertyValue(object obj, string propertyName)
        {
            if (!propertyName.Contains("."))
            {
                return GetPropertyValue(obj, propertyName);
            }
            else
            {
                int index = propertyName.IndexOf('.');
                string fp = propertyName.Substring(0, index);
                string ip = propertyName.Substring(index + 1, propertyName.Length - index - 1);
                obj = obj.GetType().GetProperty(fp).GetValue(obj);
                return GetDeepPropertyValue(obj, ip);
            }
        }
        #endregion


        public static void SetPropertyValue(object obj, string propertyName, object propertyValue)
        {
            var propertyInfo = GetPropertyInfo(obj, propertyName);
            if (propertyInfo != null)
            {
                propertyInfo.SetValue(obj, propertyValue);
            }
        }

        public static void SetPropertyValue(IEnumerable<object> objs, string propertyName, object propertyValue)
        {
            var propertyInfo = GetPropertyInfo(objs.FirstOrDefault(), propertyName);
            if (propertyInfo != null)
            {
                foreach (var obj in objs)
                {
                    propertyInfo.SetValue(obj, propertyValue);

                }

            }
        }


        #region 获取属性的描述
        /// <summary>
        /// 获取属性的描述
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        public static string GetPropertyDesc(object obj, string propertyName)
        {
            var property = GetPropertyInfo(obj, propertyName);
            if (property != null)
            {
                var cusAttrs = property.GetCustomAttributes(typeof(DescriptionAttribute));
                if (cusAttrs != null && cusAttrs.Count() > 0)
                {
                    return (cusAttrs.First() as DescriptionAttribute).Description;
                }
            }
            return string.Empty;
        }
        #endregion

        #region 获取属性的描述 包含父级属性
        /// <summary>
        /// 获取属性的描述 例 Student.Teach
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="propertyName">Student.Teacher.Name</param>
        /// <returns></returns>
        public static string GetPropertyDescWithDeep(object obj, string propertyName)
        {
            if (!propertyName.Contains("."))
            {
                return GetPropertyDesc(obj, propertyName);
            }
            else
            {
                return GetDeepPropertyDesc(obj, propertyName);
            }
            //return string.Empty;
        }
        #endregion

        #region 获取属性的描述 包含父级属性
        static string GetDeepPropertyDesc(object obj, string propertyName)
        {
            if (!propertyName.Contains("."))
            {
                return GetPropertyDesc(obj, propertyName);
            }
            else
            {
                int index = propertyName.IndexOf('.');
                string fp = propertyName.Substring(0, index);
                string ip = propertyName.Substring(index + 1, propertyName.Length - index - 1);
                obj = obj.GetType().GetProperty(fp).GetValue(obj);
                return GetDeepPropertyDesc(obj, ip);
            }
        }
        #endregion

        #region 获取属性
        /// <summary>
        /// 获取属性
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static PropertyInfo[] GetPropertyInfos(object obj, string[] propertyNames)
        {
            List<PropertyInfo> result = new List<PropertyInfo>();
            var propertyInfos = obj.GetType().GetProperties();

            foreach (var propertyInfo in propertyInfos)
            {
                if (propertyNames.FirstOrDefault(x => x.ToLower() == propertyInfo.Name.ToLower()) != null)
                    result.Add(propertyInfo);
            }
            return result.ToArray();
        }
        #endregion

        #region 将前后带空格的string Trim掉
        /// <summary>
        ///  将前后带空格的string Trim掉
        /// </summary>
        /// <param name="obj"></param>
        public static void TrimString(object obj)
        {
            var propertyInfos = obj.GetType().GetProperties().Where(x => x.PropertyType == typeof(string) && x.SetMethod != null);
            foreach (var propertyInfo in propertyInfos)
            {
                var o = propertyInfo.GetValue(obj);
                if (o != null && !string.IsNullOrWhiteSpace(o.ToString()))
                {
                    propertyInfo.SetValue(obj, o.ToString().Trim());
                }
            }
        }
        #endregion

        #region 将前后带空格的string Trim掉
        /// <summary>
        ///  将前后带空格的string Trim掉
        /// </summary>
        /// <param name="obj"></param>
        public static void TrimString(object obj, string[] propertyNames)
        {
            var propertyInfos = obj.GetType().GetProperties().Where(x => x.PropertyType == typeof(string));
            foreach (var propertyInfo in propertyInfos)
            {
                if (propertyNames.FirstOrDefault(x => x.ToLower() == propertyInfo.Name.ToLower()) == null) continue;

                var o = propertyInfo.GetValue(obj);

                if (o != null && !string.IsNullOrWhiteSpace(o.ToString()))
                {
                    propertyInfo.SetValue(obj, o.ToString().Trim());
                }
            }
        }
        #endregion

        #region  根据枚举描述获取值
        /// <summary>
        /// 根据枚举描述获取值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="des"></param>
        /// <returns></returns>
        public static object GetEnumValueByDes<T>(string des)
        {
            if (string.IsNullOrEmpty(des)) return null;
            var members = typeof(T).GetMembers().Where(x => x.MemberType == System.Reflection.MemberTypes.Field && x.Name != "value__");

            foreach (var member in members)
            {
                var customAttributes = member.GetCustomAttributes(typeof(DescriptionAttribute), false);
                if (customAttributes != null && customAttributes.Length > 0)
                {
                    DescriptionAttribute attribute = customAttributes[0] as DescriptionAttribute;
                    if (attribute.Description == des)
                    {
                        return Enum.Parse(typeof(T), member.Name);
                    }
                }
            }
            return null;
        }
        #endregion

        #region  根据枚举值获取枚举描述
        /// <summary>
        /// 根据枚举描述获取值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="des"></param>
        /// <returns></returns>
        public static string GetEnumDesByEnumValue<T>(object enumValue)
        {

            var members = typeof(T).GetMembers().Where(x => x.MemberType == System.Reflection.MemberTypes.Field && x.Name != "value__");
            string name = Enum.GetName(typeof(T), enumValue);
            foreach (var member in members)
            {
                if (member.Name == name)
                {
                    var customAttributes = member.GetCustomAttributes(typeof(DescriptionAttribute), false);
                    if (customAttributes != null && customAttributes.Length > 0)
                    {
                        DescriptionAttribute attribute = customAttributes[0] as DescriptionAttribute;
                        return attribute.Description;
                    }
                }

            }
            return string.Empty; ;
        }
        #endregion

        #region  根据枚举值获取枚举描述
        /// <summary>
        /// 根据枚举描述获取值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="des"></param>
        /// <returns></returns>
        public static string GetEnumDesByEnumValue(Type type, object enumValue)
        {

            var members = type.GetMembers().Where(x => x.MemberType == System.Reflection.MemberTypes.Field && x.Name != "value__");
            string name = Enum.GetName(type, enumValue);
            foreach (var member in members)
            {
                if (member.Name == name)
                {
                    var customAttributes = member.GetCustomAttributes(typeof(DescriptionAttribute), false);
                    if (customAttributes != null && customAttributes.Length > 0)
                    {
                        DescriptionAttribute attribute = customAttributes[0] as DescriptionAttribute;
                        return attribute.Description;
                    }
                }

            }
            return string.Empty; ;
        }
        #endregion
    }
}
