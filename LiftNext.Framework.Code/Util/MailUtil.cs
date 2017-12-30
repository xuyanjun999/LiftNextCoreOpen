using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace LiftNext.Framework.Code.Util
{
    public class MailUtil
    {
        public static void SendMail(string title, string content, string recmail, string ccmail, string[] attachFiles)
        {
            string sendUserId = "report@seungee.com";
            string sendPwd = "Sg56778018";
            string displayName = "SGMail";

            var client = new SmtpClient();
            client.Host = "smtp.exmail.qq.com";
            client.Port = 25;
            client.Credentials = new NetworkCredential(sendUserId, sendPwd);

            MailAddress f = new MailAddress(sendUserId, displayName, System.Text.Encoding.UTF8);
            MailMessage oMail = new MailMessage();
            oMail.From = f;
            string[] to = recmail.Split(';');
            foreach (var t in to)
            {
                var m = t.Trim();
                if (!string.IsNullOrEmpty(m) && m.Contains("@"))
                {
                    oMail.To.Add(m);
                }
            }
            if (oMail.To.Count == 0)
            {
                return;
            }
            if (attachFiles != null)
            {
                foreach (var file in attachFiles)
                {
                    oMail.Attachments.Add(new Attachment(file));
                }
            }

            oMail.IsBodyHtml = true; 
            oMail.BodyEncoding = System.Text.Encoding.UTF8;
            oMail.Priority = MailPriority.High;
            oMail.Subject = title;
            oMail.Body = content;
            if (!string.IsNullOrEmpty(ccmail))
            {
                string[] cclist = ccmail.Split(';');
                foreach (var c in cclist)
                {
                    var m = c.Trim();
                    if (!string.IsNullOrEmpty(m) && m.Contains("@"))
                    {
                        oMail.CC.Add(m);
                    }
                }
            }
            try
            {
                client.Send(oMail);
            }
            catch(Exception ex)
            {
                //SG.Eap.Lib.Log.EasyWrap.CommonFileLog.CurLog.Error(ex);
            }
        }
    }
}
