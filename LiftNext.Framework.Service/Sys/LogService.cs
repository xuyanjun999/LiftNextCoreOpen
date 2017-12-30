using LiftNext.Framework.Domain.Service.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LiftNext.Framework.Domain.Entity.Sys;
using LiftNext.Framework.Data.Repository;
using Microsoft.Extensions.Logging;

namespace LiftNext.Framework.Service.Sys
{
    public class LogService : ServiceBase, ILogService
    {

        private readonly ILogger<LogService> Log;

        public LogService(ILogger<LogService> logger, IRepositoryBase repository)
        {
            this.Log = logger;
            this.Repository = repository;
        }
        public void LogAction(string description, string remark, LogOperateTypeEnum logOperateType = LogOperateTypeEnum.Action)
        {
            var user = Repository.GetCurrentUser();

            LogEntity log = new LogEntity()
            {
                ActionDescription = description,
                Remark = remark,
                LogOperateTypeEnum = logOperateType,
                UserName = user == null ? "" : user.Name,
                UserCode = user == null ? "" : user.Code
            };
            Repository.Insert<LogEntity>(log);
        }
    }
}
