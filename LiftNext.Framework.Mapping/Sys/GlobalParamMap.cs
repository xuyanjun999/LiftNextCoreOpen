using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LiftNext.Framework.Domain.Entity.Sys;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LiftNext.Framework.Mapping.Sys
{
    public class GlobalParamMap : EntityConfigurationBase<GlobalParamEntity>
    {


        public override void Configure(EntityTypeBuilder<GlobalParamEntity> builder)
        {
            builder.ToTable("SGEAP_CORE_GlobalParam");
            base.Configure(builder);
        }
    }
}
