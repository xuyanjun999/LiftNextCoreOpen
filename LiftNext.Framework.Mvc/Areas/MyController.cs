
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using LiftNext.Framework.Code.Util;
using LiftNext.Framework.Code.Web;
using LiftNext.Framework.Code.Web.Dto;
using LiftNext.Framework.Data.Repository;
using System.Text;
using Newtonsoft.Json;
using LiftNext.Framework.Domain.Entity;
using LiftNext.Framework.Code.Util.Excel;
using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace LiftNext.Framework.Mvc.Areas
{
    public class MyController<T> : Controller where T : BaseEntity, new()
    {

        /// <summary>
        /// 存储操作对象
        /// </summary>
        public IRepositoryBase Repository { get; set; }

        public virtual JsonResult Single([FromBody] SingleModel singleModel)
        {
            RestResponseDto res = new RestResponseDto();
            //  var include = string.IsNullOrEmpty(include) ? null : include.Split(new char[] { ',' });
            T entity = Repository.QueryFirst<T>(x => x.ID == singleModel.Id, singleModel.Include);
            res.Entitys = new object[] { entity };
            res.Success = true;
            return Json(res);
        }

        [HttpPost]
        public virtual JsonResult Create([FromBody]CreateModel<T>  createModel)
        {
            var entity = createModel.Entity;
            RestResponseDto res = new RestResponseDto();
            ReflectionUtil.TrimString(entity);
            Repository.Insert(entity);
            res.Entitys = new object[] { Repository.QueryFirst<T>(x => x.ID == entity.ID) };
            res.Success = true;
            return Json(res);
        }

        [HttpPost]
        public virtual JsonResult Update([FromBody]UpdateModel<T> updateModel)
        {
            RestResponseDto res = new RestResponseDto();
            ReflectionUtil.TrimString(updateModel.Entity, updateModel.Modified);
            Repository.Update<T>(updateModel.Entity, updateModel.Modified);
            res.Entitys = new object[] { Repository.QueryFirst<T>(x => x.ID == updateModel.Entity.ID) };
            res.Success = true;
            return Json(res);
        }
        public virtual JsonResult Read([FromBody]CommonAjaxArgs args)
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
            res.Count = Repository.GetQueryExp<T>(predicate, includes).Count();
            res.Entitys = Repository.QueryPage<T>(predicate, new Pagination() { page = args.Page, rows = args.Limit, sidx = sort.FieldName, sord = sort.Asc ? "asc" : "desc" }, includes);
            res.Success = true;
            return Json(res);
        }

        public virtual JsonResult Delete([FromBody]DeleteModel deleteModel)
        {
            EntityResponseDto res = new EntityResponseDto();

           int count= Repository.Delete<T>(deleteModel.Ids);
            res.Success = true;
            return Json(res);
        }

        public virtual JsonResult Export([FromBody]CommonAjaxArgs args)
        {
            EntityResponseDto res = new EntityResponseDto();
            if (args.Export == null)
            {
                throw new Exception("导出参数不能为空!");
            }
            if (args.Export.Columns == null || args.Export.Columns.Count <= 0)
            {
                throw new Exception("要导出的列不能为空!");
            }
            T[] data = null;
            //判断有没有ID
            if (args.Export.Ids != null && args.Export.Ids.Count > 0)
            {
                data = Repository.QueryAll<T>(x => args.Export.Ids.Contains(x.ID), args.Include);
            }
            else if (args.Filter != null && args.Filter.Count > 0)
            {
                var predicate = ExpressionUtil.GetSearchExpression(typeof(T), args.Filter) as Expression<Func<T, bool>>;
                data = Repository.QueryAll<T>(predicate, args.Include);
            }
            else
            {
                data = Repository.QueryAll<T>(null, args.Include);
            }
            var exportPath = Path.Combine(PathUtil.GetWebRootPath(), "Templete");
            if (!Directory.Exists(exportPath)) Directory.CreateDirectory(exportPath);
            exportPath = Path.Combine(exportPath, "Output");
            if (!Directory.Exists(exportPath)) Directory.CreateDirectory(exportPath);
            string resultPath = Path.Combine(exportPath, Guid.NewGuid() + ".xlsx");
            NPOIExcelUtil.ExportEntityData<T>(data, typeof(T).Name, args.Export.Columns, resultPath);
            res.Success = true;
            res.Result.Add("Url", resultPath.Replace(PathUtil.GetWebRootPath(), ""));
            return Json(res);
        }

        public string GetUploadFile()
        {
            var uploadPath = Path.Combine(PathUtil.WebRootPath, "Upload", DateTime.Now.ToString("yyyy-MM-dd"));
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var fileName = Request.Headers["X-File-Name"];
            fileName = HttpUtility.UrlDecode(fileName);

            var phyFileName = Path.Combine(uploadPath, fileName);

            byte[] bytes = new byte[(long)Request.ContentLength];
            Request.Body.Read(bytes, 0, bytes.Length);
            //Request.Body.Seek(0, SeekOrigin.Begin);
            System.IO.File.WriteAllBytes(phyFileName, bytes);

            return phyFileName;
        }
    }

    public class CreateModel<T> where T : BaseEntity, new()
    {
        public T Entity { get; set; }

        public string[] Modified { get; set; }
    }

    public class SingleModel
    {
        public int Id { get; set; }

        public string[] Include { get; set; }
    }

    public class UpdateModel<T> where T : BaseEntity, new()
    {
        public T Entity { get; set; }
        public string[] Modified { get; set; }

    }

    public class DeleteModel
    {
        public int[] Ids { get; set; }

    }

    public class TreeNodeModel
    {
        public BaseTreeNodeEntity treeNode { get; set; }
    }
}