
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using LiftNext.Framework.Mvc.Framework.Infrastructure.Extensions;
using LiftNext.Framework.Code.Infrastructure;

namespace LiftNext.Framework.Mvc.Framework.Infrastructure
{
    public class EapMvcStartup : IEapStartup
    {
        public int Order => 30;

        public void Configure(IApplicationBuilder application)
        {
            application.UseEapMvc();
        }

        public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            var mvcBuilder= services.AddEapMvc();

           
        }
    }
}
