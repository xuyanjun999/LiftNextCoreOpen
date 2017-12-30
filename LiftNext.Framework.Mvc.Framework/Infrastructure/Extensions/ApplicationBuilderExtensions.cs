
using LiftNext.Framework.Code.Infrastructure;
using LiftNext.Framework.Code.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace LiftNext.Framework.Mvc.Framework.Infrastructure.Extensions
{
    /// <summary>
    /// Represents extensions of IApplicationBuilder
    /// </summary>
    public static class ApplicationBuilderExtensions
    {
        /// <summary>
        /// Configure the application HTTP request pipeline
        /// </summary>
        /// <param name="application">Builder for configuring an application's request pipeline</param>
        public static void ConfigureRequestPipeline(this IApplicationBuilder application)
        {
            EngineContext.Current.ConfigureRequestPipeline(application);
        }


        /// <summary>
        /// Add exception handling
        /// </summary>
        /// <param name="application">Builder for configuring an application's request pipeline</param>
        public static void UseEapStaticFiles(this IApplicationBuilder application)
        {
            application.UseStaticFiles();
        }

        /// <summary>
        /// Add exception handling
        /// </summary>
        /// <param name="application">Builder for configuring an application's request pipeline</param>
        public static void UseEapExceptionHandler(this IApplicationBuilder application)
        {
            //var nopConfig = EngineContext.Current.Resolve<NopConfig>();
            var hostingEnvironment = EngineContext.Current.Resolve<IHostingEnvironment>();
            // bool useDetailedExceptionPage = nopConfig.DisplayFullErrorStack || hostingEnvironment.IsDevelopment();
            if (hostingEnvironment.IsDevelopment())
            {
                application.UseDeveloperExceptionPage();
                application.UseBrowserLink();
            }
            else
            {
                application.UseExceptionHandler("/Error");
            }
        }

        /// <summary>
        /// Add exception handling
        /// </summary>
        /// <param name="application">Builder for configuring an application's request pipeline</param>
        public static void UseHttpSession(this IApplicationBuilder application)
        {
            application.UseSession();
        }




        /// <summary>
        /// Configure MVC routing
        /// </summary>
        /// <param name="application">Builder for configuring an application's request pipeline</param>
        public static void UseEapMvc(this IApplicationBuilder application)
        {

      //      application.UseCors(builder =>
      //builder.WithOrigins("http://localhost:8000/").AllowAnyHeader());

            application.UseMvc(routeBuilder =>
            {
                //areas
                routeBuilder.MapRoute(name: "areaRoute", template: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
                //default
                routeBuilder.MapRoute(name: "default", template: "{controller=Home}/{action=Index}/{id?}");

            });





            

        }


    }
}
