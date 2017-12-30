using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LiftNext.Framework.Code.Web.Dto;
using LiftNext.Framework.Domain.Entity.Sys;
using Microsoft.Extensions.Logging;
using LiftNext.Framework.Data.Repository;
using Microsoft.AspNetCore.Mvc;

namespace LiftNext.Framework.Mvc.Areas.Sys.Controllers
{
    public class MenuController : MyController<MenuEntity>
    {

        private readonly ILogger<MenuController> Log;

        public MenuController(ILogger<MenuController> logger, IRepositoryBase repository)
        {
            this.Log = logger;
            this.Repository = repository;
        }
        // GET: Sys/Menu
        public virtual JsonResult GetMenu(long? parentId)
        {
            EntityResponseDto res = new EntityResponseDto();

            res.Entitys = Repository.QueryAll<MenuEntity>(x => x.ParentID == parentId);
            res.Success = true;

            return Json(res);
        }
    }
}