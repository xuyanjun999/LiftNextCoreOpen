using LiftNext.Framework.Code.Web.Dto;
using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Domain.Entity.Sys;
using LiftNext.Framework.Domain.Service.Sys;
using LiftNext.Framework.Mvc.Areas.Sys.Models;
using LiftNext.Framework.Mvc.Framework.Mvc.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace LiftNext.Framework.Mvc.Areas.Sys.Controllers
{
    public class MessageController : MyController<MessageEntity>
    {
        /// <summary>
        /// 消息服务
        /// </summary>
        private readonly IMessageService MessageService; 

        private readonly ILogger<MessageController> Log;

        public MessageController(ILogger<MessageController> logger, IRepositoryBase repository, IMessageService messageService)
        {
            this.Log = logger;
            this.Repository = repository;
            this.MessageService = messageService;
        }

        /// <summary>
        /// 获取我的消息
        /// </summary>
        /// <returns></returns>
        public ActionResult GetMyMessage()
        {
            EntityResponseDto res = new EntityResponseDto();

            var result = MessageService.GetMyMessage();
            res.Success = true;
            res.Count = result.Count();
            res.Entitys = result;
            // res.Result = new { Count = res.Count, Entitys = res.Entitys };
            return Json(new { Success = res.Success, Result = res });
        }


        [AutoTransaction]
        public ActionResult HandleMyMessage([FromBody] MessageSingleModel messageSingleModel)
        {
            EntityResponseDto res = new EntityResponseDto();

            MessageService.HandleMyMessage(messageSingleModel.Id);

            res.Success = true;
            // res.Result = new { Count = res.Count, Entitys = res.Entitys };
            return Json(new { Success = res.Success, Result = res });
        }


        public ActionResult SendUpdateMessage([FromBody] SendUpdateMessageModel sendUpdateMessageModel)
        {
            ObjectResponseDto res = new ObjectResponseDto();
            MessageService.SendMessage(sendUpdateMessageModel.Title, sendUpdateMessageModel.Content, MessageTypeEnum.UpdateMessage, sendUpdateMessageModel.Minute);
            res.Success = true;
            return Json(res);
        }
     }

}