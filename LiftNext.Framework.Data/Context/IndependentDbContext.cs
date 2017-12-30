using LiftNext.Framework.Code.Infrastructure;
using LiftNext.Framework.Code.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace LiftNext.Framework.Data.Context
{
    public class IndependentDbContext : DbContext
    {
        private readonly IConfiguration Configuration;
        public IndependentDbContext(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string conn = Configuration.GetConnectionString("default");
            //if (DbUtil.IsSqlServer(conn))
            //{
            //    optionsBuilder.UseSqlServer(conn);
            //}
            //else
            //{
                optionsBuilder.UseMySql(conn);
            //}
                
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            var typeFinder = EngineContext.Current.Resolve<ITypeFinder>();

            var typeMaps = typeFinder.FindClassesOfType(typeof(IEntityTypeConfiguration<>));

            foreach (var typeMap in typeMaps)
            {
                if (typeMap.FullName.Contains("EntityConfigurationBase"))
                    continue;
                dynamic map = Activator.CreateInstance(typeMap);
                modelBuilder.ApplyConfiguration(map);
            }

            base.OnModelCreating(modelBuilder);
        }

        public string GetTableName(Type type)
        {
            return this.Model.FindEntityType(type).Relational().TableName;
        }
    }
}
