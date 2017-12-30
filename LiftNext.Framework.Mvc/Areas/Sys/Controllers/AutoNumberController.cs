using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Domain.Entity.Sys;
using LiftNext.Framework.Domain.Service.Sys;
using LiftNext.Framework.Mvc.Framework.Mvc.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;


namespace LiftNext.Framework.Mvc.Areas.Sys.Controllers
{
    public class AutoNumberController : MyController<AutoNumberEntity>
    {

        private readonly IAutoNumberService AutoNumberService;


        private readonly ILogger<AutoNumberController> Log;

        public AutoNumberController(ILogger<AutoNumberController> logger, IRepositoryBase repository, IAutoNumberService  autoNumberService)
        {
            this.Log = logger;
            this.Repository = repository;
            this.AutoNumberService = autoNumberService;
        }


        public override JsonResult Create([FromBody]CreateModel<AutoNumberEntity> createModel)
        {
            var entity = createModel.Entity;
            if (string.IsNullOrWhiteSpace(entity.Key)) throw new Exception("唯一标识不能为空!");
            entity.Key = entity.Key.Trim();
            //查看是否存在相同唯一标识
            var oldKey = Repository.QueryFirst<AutoNumberEntity>(x => x.Key == entity.Key);

            if (oldKey != null) throw new Exception("已存在此唯一标识,不能再次添加!");

            return base.Create(createModel);
        }

        [AutoTransaction]
        public override JsonResult Update([FromBody]UpdateModel<AutoNumberEntity> updateModel)
        {
            var entity = updateModel.Entity;
            var modified = updateModel.Modified;
            if (string.IsNullOrWhiteSpace(entity.Key)) throw new Exception("唯一标识不能为空!");
            entity.Key = entity.Key.Trim();
            //查看是否存在相同唯一标识
            var oldKey = Repository.QueryFirst<AutoNumberEntity>(x => x.Key == entity.Key && x.ID != entity.ID);

            if (oldKey != null) throw new Exception("已存在此唯一标识!");

            return base.Update(updateModel);
        }

        public JsonResult Test(int count)
        {
            for (int i = 0; i < count; i++)
            {
                string number = AutoNumberService.MakeAutoNumber("ProjectItemNo", string.Format("{0}{1}{2}", "XC", DateTime.Now.ToString("yyMM"), "A"));
                Log.LogDebug(number);
                Thread.Sleep(100);
            }
            return Json(new { Success = true });
        }
    }
}