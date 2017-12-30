using LiftNext.Framework.Code.Util;
using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Domain.Service.Sys;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Service.Sys
{
    public class MailService : ServiceBase, IMailService
    {
        private readonly ILogger<MailService> Log;

        public MailService(ILogger<MailService> logger, IRepositoryBase repository)
        {
            this.Log = logger;
            this.Repository = repository;
        }

        public string SendMail(string title, string content, string recmail, string ccmail = null, string[] attachFiles = null)
        {
            try
            {
                MailUtil.SendMail(title, content, recmail, ccmail, attachFiles);
                return string.Empty;
            }
            catch (Exception ex)
            {
                Log.LogError(ex.Message, ex);
                return ex.Message;
            }
        }

        public void SendMailAsync(string title, string content, string recmail, string ccmail = null, string[] attachFiles = null)
        {
            try
            {
                Task.Factory.StartNew(() =>
                {
                    MailUtil.SendMail(title, content, recmail, ccmail, attachFiles);
                });
            }
            catch (Exception ex)
            {
                Log.LogError(ex,ex.Message);
            }
        }
    }
}
