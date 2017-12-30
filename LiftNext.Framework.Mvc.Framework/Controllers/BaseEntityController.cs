
using LiftNext.Framework.Code.Util;
using LiftNext.Framework.Code.Web;
using LiftNext.Framework.Code.Web.Dto;
using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Domain.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace LiftNext.Framework.Mvc.Framework.Controllers
{
    public class BaseEntityController<T> : BaseController where T : BaseEntity,new ()
    {

        protected readonly IRepositoryBase _repository;

        public BaseEntityController(IRepositoryBase repositoryBase)
        {
            this._repository = repositoryBase;
        }

        public virtual JsonResult Single(int id, string[] include)
        {
            RestResponseDto res = new RestResponseDto();
            //  var include = string.IsNullOrEmpty(include) ? null : include.Split(new char[] { ',' });
            T entity = _repository.QueryFirst<T>(x => x.ID == id, include);
            res.Entitys = new object[] { entity };
            res.Success = true;
            return Json(res);
        }

        [HttpPost]
        public virtual JsonResult Create(T entity)
        {
            RestResponseDto res = new RestResponseDto();
            ReflectionUtil.TrimString(entity);
            _repository.Insert(entity);
            res.Entitys = new object[] { _repository.QueryFirst<T>(x => x.ID == entity.ID) };
            res.Success = true;
            return Json(res);
        }

        [HttpPost]
        public virtual JsonResult Update(T entity, string[] modified)
        {
            RestResponseDto res = new RestResponseDto();
            ReflectionUtil.TrimString(entity, modified);
            _repository.Update<T>(entity, modified);
            res.Entitys = new object[] { _repository.QueryFirst<T>(x => x.ID == entity.ID) };
            res.Success = true;
            return Json(res);
        }

        
        public virtual JsonResult Read(CommonAjaxArgs args)
        {
            EntityResponseDto res = new EntityResponseDto();

            var predicate = ExpressionUtil.GetSearchExpression(typeof(T), args.Filter) as Expression<Func<T, bool>>;

            args.Limit = args.Limit <= 0 ? 50 : args.Limit;

            args.Page = args.Page == 0 ? 1 : args.Page;

            Sorter sort = null;
            if (args.Sort.Count > 0)
            {
                sort = new Sorter() { FieldName = args.Sort[0].FieldName, Asc = args.Sort[0].Asc };
            }
            else
            {
                sort = new Sorter() { FieldName = "ID", Asc = false };
            }
            string[] includes = args.Include;
            res.Count = _repository.GetQueryExp<T>(predicate, includes).Count();
            res.Entitys = _repository.QueryPage<T>(predicate, new Pagination() { page = args.Page, rows = args.Limit, sidx = sort.FieldName, sord = sort.Asc ? "asc" : "desc" }, includes);
            res.Success = true;
            return Json(res);
        }

        public virtual JsonResult Delete(int[] ids)
        {
            EntityResponseDto res = new EntityResponseDto();

            _repository.Delete<T>(ids);
            res.Success = true;
            return Json(res);
        }

    }
}
