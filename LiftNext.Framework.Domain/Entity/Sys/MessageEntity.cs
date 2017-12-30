using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Entity.Sys
{

    public class MessageEntity : BaseAcsRecEntity
    {
        /// <summary>
        /// 发件人ID
        /// </summary>
        public int SenderID { get; set; }


        /// <summary>
        /// 接收人ID
        /// </summary>
        public int? ReceiverID { get; set; }


        /// <summary>
        /// 是否已读
        /// </summary>
        public bool IsReaded { get; set; }

        /// <summary>
        /// 是否已处理
        /// </summary>
        public bool IsHandled { get; set; }

        /// <summary>
        /// 是否需要处理
        /// </summary>
        public bool IsNeedHandle{ get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 信息类型
        /// </summary>
        public int Type { get; set; }

        /// <summary>
        /// 信息类型枚举
        /// </summary>
        [JsonIgnore]
        [NotMapped]
        public MessageTypeEnum MessageTypeEnum
        {
            get { return (MessageTypeEnum)Type; }
            set { Type = (int)value; }
        }

        /// <summary>
        /// 系统发送时间
        /// </summary>
        public DateTime SendDate { get; set; }

        /// <summary>
        /// 消息过期时间
        /// </summary>
        public DateTime? ExpiryTime { get; set; }
    }
    /// <summary>
    /// 信息类型枚举
    /// </summary>
    public enum MessageTypeEnum
    {
        /// <summary>
        /// 系统信息
        /// </summary>
        SystemMessage = 0,
        /// <summary>
        /// 系统更新消息
        /// </summary>
        UpdateMessage = 1,
        /// <summary>
        /// 流程消息
        /// </summary>
        WorkFlowMessage = 2
    }
}
