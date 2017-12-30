using LiftNext.Framework.Code.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using LiftNext.Framework.Code.Web;

namespace LiftNext.Framework.Code.Dependency
{
    public class DependencyRegistrar : IDependencyRegistrar
    {
        public int Order => 10;

        public void Register(IServiceCollection services, ITypeFinder typeFinder, IConfiguration configuration)
        {
            services.AddSingleton<IWebHelper, WebHelper>();
        }
    }
}
