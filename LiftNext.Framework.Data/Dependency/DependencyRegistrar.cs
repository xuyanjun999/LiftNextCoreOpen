using LiftNext.Framework.Code.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using LiftNext.Framework.Code.Web;
using LiftNext.Framework.Data.SQL;
using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Data.Context;
using Microsoft.EntityFrameworkCore;
using LiftNext.Framework.Code.Util;

namespace LiftNext.Framework.Data.Dependency
{
    public class DependencyRegistrar : IDependencyRegistrar
    {
        public int Order => 20;

        public void Register(IServiceCollection services, ITypeFinder typeFinder, IConfiguration configuration)
        {

            string connStr = configuration.GetConnectionString("default");

            //if (DbUtil.IsSqlServer(connStr))
            //{
            //    services.AddDbContextPool<EapDbContext>(option =>
            //    {
            //        option.UseSqlServer(connStr);
            //    });
            //    services.AddSingleton(typeof(ISQLBuilder), new MSSQLBuilder());
            //}
            //else
            //{
            services.AddDbContextPool<EapDbContext>(option =>
            {
                //option.UseMySQL(connStr);
                option.UseMySql(connStr);
            });

            services.AddSingleton(typeof(ISQLBuilder), new MySQLBuilder());
            //  }



            services.AddScoped(typeof(IndependentDbContext));

            // services.AddSingleton(typeof(ISQLBuilder), new MySQLBuilder());
            services.AddScoped(typeof(IRepositoryBase), typeof(RepositoryBase));
            services.AddScoped(typeof(IIndependentRepository), typeof(IndependentRepository));
        }
    }
}
