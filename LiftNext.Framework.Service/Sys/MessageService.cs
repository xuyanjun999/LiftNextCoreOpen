using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Domain.Entity.Sys;
using LiftNext.Framework.Domain.Service.Sys;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Service.Sys
{
    public class MessageService : ServiceBase, IMessageService
    {
        private readonly ILogger<MessageService> Log;

        public MessageService(ILogger<MessageService> logger, IRepositoryBase repository)
        {
            this.Log = logger;
            this.Repository = repository;
        }
        #region APP端获取我当前需要读取的消息
        /// <summary>
        /// 获取我当前需要读取的消息
        /// </summary>
        /// <returns></returns>
        public IEnumerable<MessageEntity> GetMyMessage(int userId)
        {
            List<MessageEntity> result = new List<MessageEntity>();

            var myMessages = Repository.QueryAll<MessageEntity>(x => (x.ReceiverID == userId && x.IsReaded == false && x.IsHandled == false));
            result.AddRange(myMessages);

            //我现在读的消息改为已读
            foreach (var message in myMessages)
            {
                message.IsReaded = true;
                Repository.Update(message, x => x.IsReaded);
            }

            //我现在读的不需要处理的消息就改为已处理
            foreach (var message in myMessages.Where(x => !x.IsNeedHandle))
            {
                message.IsHandled = true;
                Repository.Update(message, x => x.IsHandled);
            }

            return result;

        }
        #endregion

        #region 获取我当前需要读取的消息
        /// <summary>
        /// 获取我当前需要读取的消息
        /// </summary>
        /// <returns></returns>
        public IEnumerable<MessageEntity> GetMyMessage()
        {
            var user = Repository.GetCurrentUser();
            //获取五分钟之内的系统消息 和 我自己未读取的数据
            List<MessageEntity> result = new List<MessageEntity>();
            if (user != null)
            {
                if (user.ReadedMessageIds == null) user.ReadedMessageIds = new List<int>();

                var myMessages = Repository.QueryAll<MessageEntity>(x => (x.ReceiverID == user.ID && x.IsReaded == false && x.IsHandled == false));

                var fiveMinuteBefore = DateTime.Now.AddMinutes(-5);

                var sysMessages = Repository.GetQueryExp<MessageEntity>(x => x.IsReaded == false && (x.ReceiverID == 0 || x.ReceiverID == null)).Where(x => !user.ReadedMessageIds.Contains(x.ID)).Where(x => x.CreateOn >= fiveMinuteBefore).ToArray();

                result.AddRange(myMessages);
                result.AddRange(sysMessages);

                //我现在读的消息改为已读
                foreach (var message in myMessages)
                {
                    message.IsReaded = true;
                    Repository.Update(message, x => x.IsReaded);
                }

                //我现在读的不需要处理的消息就改为已处理
                foreach (var message in myMessages.Where(x => !x.IsNeedHandle))
                {
                    message.IsHandled = true;
                    Repository.Update(message, x => x.IsHandled);
                }
                //我现在读的系统消息放入session
                user.ReadedMessageIds.AddRange(sysMessages.Select(x => x.ID));

            }

            return result;

        }
        #endregion

        #region 处理我的消息
        /// <summary>
        /// 处理我的消息
        /// </summary>
        /// <param name="id"></param>
        public void HandleMyMessage(int id)
        {
            MessageEntity message = Repository.QueryFirst<MessageEntity>(x => x.ID == id);
            if (message != null)
            {
                message.IsHandled = true;
                Repository.Update(message, x => x.IsHandled);
            }
        }
        #endregion

        #region 发送消息
        public void SendMessage(string title, string message, MessageTypeEnum messageType)
        {
            SendMessage(title, message, 0, messageType, 5, false);
        }

        public void SendMessage(string title, string message, MessageTypeEnum messageType, int expiryMinute)
        {
            SendMessage(title, message, 0, messageType, expiryMinute, false);
        }

        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="title"></param>
        /// <param name="message"></param>
        public void SendMessage(string title, string message)
        {
            SendMessage(title, message, 0, MessageTypeEnum.SystemMessage, 0, false);
        }
        #endregion

        #region 发送消息
        public void SendMessage(string title, string message, int receiverId, MessageTypeEnum messageType, int expiryMinute, bool isNeedHandle = false)
        {
            SendMessage(title, message, new int[] { receiverId }, messageType, expiryMinute,  isNeedHandle);
        }
        #endregion

        #region 发送消息
        public void SendMessage(string title, string message, IEnumerable<int> receiverIds, MessageTypeEnum messageType, int expiryMinute, bool isNeedHandle = false)
        {
            var user = Repository.GetCurrentUser();
            List<MessageEntity> needAdd = new List<MessageEntity>();
            foreach (var receiverId in receiverIds)
            {
                MessageEntity mes = new MessageEntity()
                {
                    Title = title,
                    Content = message,
                    SendDate = DateTime.Now,
                    SenderID = user == null ? 0 : user.ID,
                    ReceiverID = receiverId,
                    IsNeedHandle = isNeedHandle,
                    MessageTypeEnum = messageType
                };
                if(messageType == MessageTypeEnum.UpdateMessage)
                {
                    mes.ExpiryTime = mes.SendDate.AddMinutes(expiryMinute);
                }
                needAdd.Add(mes);
            }
            Repository.InsertNoId(needAdd);

        }
        #endregion
    }
}
