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
    public class MenuMap : EntityConfigurationBase<MenuEntity>
    {


        public override void Configure(EntityTypeBuilder<MenuEntity> builder)
        {
            builder.ToTable("SGEAP_CORE_Menu");
            builder.HasOne(x => x.Parent).WithMany().HasForeignKey(x => x.ParentID);
            base.Configure(builder);
        }
    }
}
