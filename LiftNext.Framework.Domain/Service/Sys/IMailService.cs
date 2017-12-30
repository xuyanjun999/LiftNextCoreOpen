using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Service.Sys
{
    public interface IMailService : IServiceBase
    {
        string SendMail(string title, string content, string recmail, string ccmail = null, string[] attachFiles = null);
        void SendMailAsync(string title, string content, string recmail, string ccmail = null, string[] attachFiles = null);
    }
}
