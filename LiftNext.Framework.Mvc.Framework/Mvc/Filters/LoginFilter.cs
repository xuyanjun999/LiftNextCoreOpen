using LiftNext.Framework.Code.Infrastructure;
using LiftNext.Framework.Code.Util;
using LiftNext.Framework.Code.Web;
using LiftNext.Framework.Mvc.Framework.Mvc.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Linq;
using System.Reflection;

namespace LiftNext.Framework.Mvc.Framework.Mvc.Filters
{
    public class LoginFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var methodInfo = ReflectionUtil.GetPropertyValue(context.ActionDescriptor, "MethodInfo") as MethodInfo;
            if (methodInfo != null)
            {
                var notCheckUserAttribute = methodInfo.GetCustomAttribute(typeof(NotCheckUserAttribute)) as NotCheckUserAttribute;
                if (notCheckUserAttribute==null)
                {
                    var iwebHelper = EngineContext.Current.Resolve<IWebHelper>();
                    var user = iwebHelper?.GetUser();
                    if (user == null)
                    {
                        context.Result = new JsonResult(new
                        {
                            Success = false,
                            ErrorCode = (int)HttpStatusCode.Unauthorized,
                            Message = "用户无效,请重新登录系统",
                        });

                    }

                }
            }
        }



    }
}
