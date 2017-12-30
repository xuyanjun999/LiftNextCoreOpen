using LiftNext.Framework.Code.Web.Dto;
using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Domain.Entity.Sys;
using LiftNext.Framework.Mvc.Areas.Sys.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace LiftNext.Framework.Mvc.Areas.Sys.Controllers
{
    public class ServerConfigController : MyController<GlobalParamEntity>
    {

        private readonly ILogger<ServerConfigController> Log;

        public ServerConfigController(ILogger<ServerConfigController> logger, IRepositoryBase repository)
        {
            this.Log = logger;
            this.Repository = repository;
        }

        public JsonResult UpdateServerConfig([FromBody] ServerConfigModel serverConfigModel)
        {
            ObjectResponseDto res = new ObjectResponseDto();
            foreach(var item in serverConfigModel.FormValues)
            {
                var globalParam = Repository.QueryFirst<GlobalParamEntity>(c => c.KeyName == item.Key);
                if(globalParam == null)
                {
                    globalParam = new GlobalParamEntity()
                    {
                        KeyName = item.Key,
                        KeyValue = item.Value
                    };
                    Repository.Insert(globalParam);
                }
                else
                {
                    globalParam.KeyValue = item.Value;
                    Repository.Update(globalParam);
                }
            }
            res.Success = true;
            return Json(res);
        }

        public JsonResult GetServerConfig()
        {
            ObjectResponseDto res = new ObjectResponseDto();
            var codes = new string[] { "CADWebAddress", "CADWebVersion", "CADSaveAsFileType", "CADSaveAsDwgFileType", "CADSaveAsPdfLayout", "CADSaveAsPngLayout", "AppResetCalcParamCode", "AppMustCalcParamCode", "AppRelateCalcParamCode" };
            var globalParams = Repository.GetQueryExp<GlobalParamEntity>(c => codes.Contains(c.KeyName)).ToList();
            var dic = new Dictionary<string, string>();
            globalParams.ForEach((item) =>
            {
                dic.Add(item.KeyName, item.KeyValue);
            });
            res.Result = dic;
            res.Success = true;
            return Json(res);
        }
    }
}