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
    public class LogEntity : BaseAcsRecTreeNodeEntity
    {
        /// <summary>
        /// 操作类型
        /// </summary>
        public int OperateType { get; set; }

        /// <summary>
        /// 操作类型
        /// </summary>
        [JsonIgnore]
        [NotMapped]
        public LogOperateTypeEnum LogOperateTypeEnum
        {
            get { return (LogOperateTypeEnum)OperateType; }
            set { OperateType = (int)value; }
        }

        /// <summary>
        /// 用户名称
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 用户代号
        /// </summary>
        public string UserCode { get; set; }

        /// <summary>
        /// 动作描述
        /// </summary>
        public string ActionDescription { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }

    public enum LogOperateTypeEnum
    {
        /// <summary>
        /// 动作
        /// </summary>
        [Description("动作")]
        Action = 0,

        /// <summary>
        /// 登录
        /// </summary>
        [Description("登录")]
        Login = 5
    }
}
