
using LiftNext.Framework.Code.Infrastructure;
using LiftNext.Framework.Code.Util;
using LiftNext.Framework.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LiftNext.Framework.Mvc.Framework.Mvc.Attributes
{
    public class AutoTransactionAttribute : Attribute, IActionFilter
    {

        public AutoTransactionAttribute(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
        {
            this.IsolationLevel = isolationLevel;
        }

        /// <summary>
        /// 事务隔离级别
        /// </summary>
        public IsolationLevel IsolationLevel { get; set; }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            var controller = context.Controller;

            var repository = ReflectionUtil.GetPropertyValue(controller, "Repository") as IRepositoryBase;

            if (context.Exception != null)
            {
                repository?.Rollback();

                context.Result = new JsonResult(new
                {
                    Success = false,
                    Message = context.Exception.Message
                });

                context.ExceptionHandled = true;

                var log = EngineContext.Current.Resolve<ILogger<AutoTransactionAttribute>>();
                var msg = context.Exception.InnerException == null ? context.Exception.Message : context.Exception.InnerException.Message;
                var msgFormat = $"{msg} StackTrace:{context.Exception.StackTrace}";
                log?.LogError(context.Exception, msgFormat);

            }
            else
            {
                repository?.Commit();
            }


        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var controller = context.Controller;
            var repository = ReflectionUtil.GetPropertyValue(controller, "Repository") as IRepositoryBase;
            repository?.BeginTran();


        }
    }
}
