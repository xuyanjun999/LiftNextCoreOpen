using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using Newtonsoft.Json;

namespace LiftNext.Framework.Domain.Entity
{
    /// <summary>
    /// 数据表映射实体基类
    /// </summary>
    public class BaseEntity
    {
        /// <summary>
        /// 每个表实例映射主键ID
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// StatusEnum的EF映射辅助字段
        /// </summary>
        public BaseEntityStatus Status { get; set; }
    }

}
