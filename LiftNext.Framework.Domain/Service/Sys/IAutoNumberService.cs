using LiftNext.Framework.Domain.Entity.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Service.Sys
{
    public interface IAutoNumberService : IServiceBase
    {
        /// <summary>
        /// 生成自动编号
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        string MakeAutoNumber(string key);

        /// <summary>
        /// 生成自动编号
        /// </summary>
        /// <param name="key"></param>
        /// <param name="pref">类似pref+0001 pref会覆盖默认规则</param>
        /// <returns></returns>
        string MakeAutoNumber(string key, string pref);

        /// <summary>
        /// 生成自动编号
        /// </summary>
        /// <param name="key"></param>
        /// <param name="group">分组编号</param>
        /// <param name="pref">类似pref+0001 pref会覆盖默认规则</param>
        /// <returns></returns>
        string MakeAutoNumber(string key, string group, string pref, AutoNumberResetModeEnum resetMode, int numDigit = 4);
    }
}
