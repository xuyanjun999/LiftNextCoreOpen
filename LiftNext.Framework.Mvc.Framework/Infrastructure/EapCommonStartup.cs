
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using LiftNext.Framework.Mvc.Framework.Infrastructure.Extensions;
using LiftNext.Framework.Code.Infrastructure;

namespace LiftNext.Framework.Mvc.Framework.Infrastructure
{
    public class EapCommonStartup : IEapStartup
    {
        public int Order => 10;

        public void Configure(IApplicationBuilder application)
        {
            application.UseEapStaticFiles();

            application.UseHttpSession();
        }

        public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpSession(configuration);
        }
    }
}
