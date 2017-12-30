using LiftNext.Framework.Domain.Entity.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Service.Sys
{
    public interface ILogService:IServiceBase
    {
        /// <summary>
        /// 记录日志
        /// </summary>
        /// <param name="description"></param>
        /// <param name="remark"></param>
        /// <param name="logOperateType"></param>
        void LogAction(string description, string remark, LogOperateTypeEnum logOperateType = LogOperateTypeEnum.Action);
    }
}
