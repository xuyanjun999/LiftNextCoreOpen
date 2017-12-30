using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LiftNext.Framework.Domain.Entity
{
    /// <summary>
    /// 表操作记录基类
    /// </summary>
    public class BaseAcsRecEntity : BaseEntity,IAccessRecordEntity<int>
    {
        /// <summary>
        /// 创建人相关ID
        /// </summary>
        public int CreateBy { get; set; }
        /// <summary>
        /// 创建相关时间
        /// </summary>
        public DateTime CreateOn { get; set; }
        /// <summary>
        /// 更新人相关ID
        /// </summary>
        public int UpdateBy { get; set; }
        /// <summary>
        /// 更新相关时间
        /// </summary>
        public DateTime UpdateOn { get; set; }
    }
}
