﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace LiftNext.Framework.Domain.Entity
{
    /// <summary>
    /// 实现树节点接口和操作信息记录接口的实体基类
    /// </summary>
    public class BaseTreeNodeEntity : BaseEntity, ITreeNodeEntity
    {
        public BaseTreeNodeEntity()
        {
            this.Children = new List<BaseTreeNodeEntity>();
        }
        #region ITreeNodeEntity接口数据
        /// <summary>
        /// 是否末节点  节点数量大的，请不要判断是否是叶节点
        /// </summary>
        [NotMapped]
        public virtual bool Leaf { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [NotMapped]
        public virtual string Text { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [NotMapped]
        public virtual string Data { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [NotMapped]
        public virtual string IconRes { get; set; }
        /// <summary>
        /// 
        /// </summary>
        [NotMapped]
        public virtual bool Checked { get; set; }

        /// <summary>
        /// 是否展开
        /// </summary>
        [NotMapped]
        public virtual bool Expanded { get; set; }
        /// <summary>
        /// 层级
        /// </summary>
        [NotMapped]
        public virtual int Level { get; set; }

        [NotMapped]
        public int PID { get; set; }
        [NotMapped]
        public virtual string Data1 { get; set; }
        [NotMapped]
        public virtual string Data2 { get; set; }
        [NotMapped]
        public virtual string Data3 { get; set; }
        /// <summary>
        /// 子节点
        /// </summary>
        [NotMapped]
        public virtual List<BaseTreeNodeEntity> Children { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        public virtual void FormatTreeNodeValue(object context)
        {
            
        }
        #endregion

    }
}