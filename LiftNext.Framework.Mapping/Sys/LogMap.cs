using LiftNext.Framework.Domain.Entity.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LiftNext.Framework.Mapping.Sys
{
    public class LogMap : EntityConfigurationBase<LogEntity>
    {


        public override void Configure(EntityTypeBuilder<LogEntity> builder)
        {
            builder.ToTable("SGEAP_CORE_Log");
            base.Configure(builder);
        }
    }
}
