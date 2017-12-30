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
    /// <summary>
    /// 自动编号
    /// </summary>
    public class AutoNumberEntity : BaseAcsRecTreeNodeEntity
    {
        /// <summary>
        /// 唯一标识
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// 重置方式
        /// </summary>
        public int ResetMode { get; set; }

        /// <summary>
        /// 重置方式
        /// </summary>
        [NotMapped]
        [JsonIgnore]
        public AutoNumberResetModeEnum AutoNumbeResetModeEnum
        {
            get => (AutoNumberResetModeEnum)ResetMode;
            set => ResetMode = (int)value;
        }

        /// <summary>
        /// 起始字符
        /// </summary>
        public string Pref { get; set; }

        /// <summary>
        ///例如  yyyyMMdd
        /// </summary>
        public string DateFormat { get; set; }

        /// <summary>
        /// 编号
        /// </summary>
        public int Num { get; set; }

        /// <summary>
        /// 编号位数
        /// </summary>
        public int NumDigit { get; set; }

        /// <summary>
        /// 分组（重置规则之一）
        /// </summary>
        public string Group { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

    }


    /// <summary>
    /// 重置方式
    /// </summary>
    public enum AutoNumberResetModeEnum
    {
        /// <summary>
        /// 按日重置
        /// </summary>
        [Description("按日重置")]
        Day = 0,

        /// <summary>
        /// 按月重置
        /// </summary>
        [Description("按月重置")]
        Month = 5,

        /// <summary>
        /// 按年重置
        /// </summary>
        [Description("按年重置")]
        Year = 10,

    }
}
