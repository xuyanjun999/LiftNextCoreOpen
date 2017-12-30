using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Entity.Sys
{
    public class GlobalParamEntity : BaseTreeNodeEntity
    {
        /// <summary>
        /// 序号
        /// </summary>
        public decimal KeySeq { get; set; }
        /// <summary>
        /// 键名
        /// </summary>
        public string KeyName { get; set; }
        /// <summary>
        /// 键值
        /// </summary>
        public string KeyValue { get; set; }
        /// <summary>
        /// 描述
        /// </summary>
        public string KeyDes { get; set; }
        /// <summary>
        /// 备注1
        /// </summary>
        public string KeyDef1 { get; set; }
        /// <summary>
        /// 备注2
        /// </summary>
        public string KeyDef2 { get; set; }
        /// <summary>
        /// 备注3
        /// </summary>
        public string KeyDef3 { get; set; }
    }
}
