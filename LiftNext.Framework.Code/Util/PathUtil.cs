using LiftNext.Framework.Code.Infrastructure;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace LiftNext.Framework.Code.Util
{
    public class PathUtil
    {

        public static string WebRootPath { get; set; }

        public static string ContentRootPath { get; set; }

        /// <summary>
        /// 获取Web根目录
        /// </summary>
        /// <returns></returns>
        public static string GetWebRootPath()
        {
            return WebRootPath;
        }

        /// <summary>
        /// 取得物理路径
        /// </summary>
        /// <param name="url">相对路径 Url需要"/"开头</param>
        /// <returns></returns>
        public static string GetPhysicalPathByUrl(string url)
        {
            //TODO:针对windows平台需要单独处理,以下为临时方案
            return string.Format("{0}{1}", WebRootPath, url);// string.Format("{0}{1}", WebRootPath, url.Replace("/", "\\"));
        }

        /// <summary>
        /// 取得相对路径
        /// </summary>
        /// <param name="fileName">包含完整物理路径的文件名</param>
        /// <returns></returns>
        public static string GetUrlByPhysicalPath(string fileName)
        {
            return fileName.Replace(GetWebRootPath(), "").Replace("\\", "/");
        }

        public static string GetFullUrlByPhysicalPath(IHttpContextAccessor _httpContextAccessor,string fileName)
        {
            var host = _httpContextAccessor.HttpContext.Request.Host;
            return string.Format("http://{0}:{1}{2}", host.Host,host.Port, GetUrlByPhysicalPath(fileName));
            //return fileName.Replace(GetWebRootPath(), "/").Replace("\\", "/");
        }

        public static string GetWebHost()
        {
            var httpContext = EngineContext.Current.Resolve<IHttpContextAccessor>();
            var httpHost = httpContext.HttpContext.Request.Host;
                        
            var host = httpHost.Host;
            var port = httpHost.Port;
            if (host.Contains("liftnext.com"))
            {
                return string.Format("http://{0}", host);
            }
            else
            {
                return string.Format("http://{0}:{1}", host, port);
            }
        }

        public static string GetFullUrlByPhysicalPath(string fileName)
        {
            return string.Format("{0}{1}", GetWebHost(), fileName.Replace(GetWebRootPath(), "/").Replace("\\", "/"));
        }
    }
}
