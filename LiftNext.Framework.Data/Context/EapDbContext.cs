using LiftNext.Framework.Code.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace LiftNext.Framework.Data.Context
{
    public class EapDbContext : DbContext
    {
        public EapDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            var typeFinder = EngineContext.Current.Resolve<ITypeFinder>();

            var typeMaps = typeFinder.FindClassesOfType(typeof(IEntityTypeConfiguration<>));

            foreach(var typeMap in typeMaps)
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
