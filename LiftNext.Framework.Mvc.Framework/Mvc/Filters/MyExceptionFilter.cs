using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Logging;
using System.Net;
using LiftNext.Framework.Code.Infrastructure;

namespace LiftNext.Framework.Mvc.Framework.Mvc.Filters
{
    public class MyExceptionFilter : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {


            var log = EngineContext.Current.Resolve<ILogger<MyExceptionFilter>>();
            var msg = context.Exception.InnerException == null ? context.Exception.Message : context.Exception.InnerException.Message;
            var msgFormat = $"{msg} StackTrace:{context.Exception.StackTrace}";
            log?.LogError(context.Exception, msgFormat);

            //ajax请求
            //  if (context.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            // {
            //var repository = EngineContext.Current.Resolve<IRepositoryBase>();
            //repository.Rollback();



            //var logger = EngineContext.Current.Resolve<ILogger<MyExceptionFilter>>();
            //logger.LogError(context.Exception.InnerException ?? context.Exception, "");

            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            context.ExceptionHandled = true;
            context.Result = new JsonResult(new
            {
                Success = false,
                Message = context.Exception.Message
            });
        }


    }
}

