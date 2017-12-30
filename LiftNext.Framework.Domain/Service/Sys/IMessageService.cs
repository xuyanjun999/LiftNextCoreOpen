using LiftNext.Framework.Domain.Entity.Sys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Service.Sys
{
    public interface IMessageService : IServiceBase
    {
        /// <summary>
        /// APP端获取我当前需要读取的消息
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        IEnumerable<MessageEntity> GetMyMessage(int userId);
        /// <summary>
        /// 获取我当前需要读取的消息
        /// </summary>
        /// <returns></returns>
        IEnumerable<MessageEntity> GetMyMessage();

        /// <summary>
        /// 处理我的消息
        /// </summary>
        /// <param name="id"></param>
        void HandleMyMessage(int id);

        /// <summary>
        /// 发送消息给全体用户
        /// </summary>
        /// <param name="title"></param>
        /// <param name="message"></param>
        void SendMessage(string title, string message);

        void SendMessage(string title, string message, MessageTypeEnum messageType);
        void SendMessage(string title, string message, MessageTypeEnum messageType, int expiryMinute);
        
        /// <summary>
        /// 发送消息给指定人员
        /// </summary>
        /// <param name="title"></param>
        /// <param name="message"></param>
        /// <param name="receiverId"></param>
        /// <param name="isNeedHander">是否需要指定人员进行处理</param>
        void SendMessage(string title, string message, int receiverId, MessageTypeEnum messageType, int expiryMinute, bool isNeedHandle = false);

        /// <summary>
        /// 发送消息给指定人员集合
        /// </summary>
        /// <param name="title"></param>
        /// <param name="message"></param>
        /// <param name="receiverIds"></param>
        /// <param name="isNeedHander">是否需要指定人员进行处理</param>
        void SendMessage(string title, string message, IEnumerable<int> receiverIds, MessageTypeEnum messageType, int expiryMinute, bool isNeedHandle = false);
    }
}
