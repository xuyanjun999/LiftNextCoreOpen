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
    public class DicConfigMap : EntityConfigurationBase<DicConfigEntity>
    {

        public override void Configure(EntityTypeBuilder<DicConfigEntity> builder)
        {
            builder.ToTable("sys_dicconfig");
            builder.HasOne(x => x.Parent).WithMany().HasPrincipalKey(x => x.ParentID);
            base.Configure(builder);
        }
    }
}
