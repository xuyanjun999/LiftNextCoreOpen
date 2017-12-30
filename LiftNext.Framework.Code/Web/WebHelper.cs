using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace LiftNext.Framework.Code.Web
{
    public class WebHelper : IWebHelper
    {

        public static readonly string USER_LOGIN_SESSION = "user_login_session";

        private readonly IHttpContextAccessor _httpContextAccessor;

        public WebHelper(IHttpContextAccessor httpContextAccessor)
        {
            this._httpContextAccessor = httpContextAccessor;
        }



        #region Session操作
        /// <summary>
        /// 写Session
        /// </summary>
        /// <typeparam name="T">Session键值的类型</typeparam>
        /// <param name="key">Session的键名</param>
        /// <param name="value">Session的键值</param>
        public void WriteSession<T>(string key, T value)
        {
            if (string.IsNullOrEmpty(key))
                return;
            _httpContextAccessor.HttpContext.Session.SetString(key, JsonConvert.SerializeObject(value));
        }

        /// <summary>
        /// 写Session
        /// </summary>
        /// <param name="key">Session的键名</param>
        /// <param name="value">Session的键值</param>
        public void WriteSession(string key, string value)
        {
            WriteSession<string>(key, value);
        }

        /// <summary>
        /// 读取Session的值
        /// </summary>
        /// <param name="key">Session的键名</param>        
        public string GetSession(string key)
        {
            if (string.IsNullOrEmpty(key))
                return string.Empty;
            return _httpContextAccessor.HttpContext.Session.GetString(key);
        }

        /// <summary>
        /// 读取Session的值
        /// </summary>
        /// <param name="key">Session的键名</param>        
        public T GetSession<T>(string key)
        {
            if (string.IsNullOrEmpty(key))
                return default(T);
            if (_httpContextAccessor.HttpContext.Session == null)
                return default(T);
            string value = _httpContextAccessor.HttpContext.Session.GetString(key);
            if (string.IsNullOrWhiteSpace(value)) return default(T);
            return JsonConvert.DeserializeObject<T>(value);
        }

        /// <summary>
        /// 获取当前用户
        /// </summary>
        /// <param name="key">获取当前用户</param>        
        public User GetUser()
        {
            User user = GetSession<User>(USER_LOGIN_SESSION);
            //if (user == null)
            //    user = new User() { ID = -1 };
            return user;
        }


        /// <summary>
        /// 获取当前用户
        /// </summary>
        /// <param name="key">获取当前用户</param>        
        public void SetUser(User user)
        {
            if (_httpContextAccessor.HttpContext.Session == null)
                return;
            WriteSession<User>(USER_LOGIN_SESSION, user);
        }

        /// <summary>
        /// 移除当前用户
        /// </summary>
        /// <param name="key">移除当前用户</param>        
        public void RemoveUser()
        {
            if (_httpContextAccessor.HttpContext.Session == null)
                return;
            WriteSession(USER_LOGIN_SESSION, null);
        }

        /// <summary>
        /// 删除指定Session
        /// </summary>
        /// <param name="key">Session的键名</param>
        public void RemoveSession(string key)
        {
            if (string.IsNullOrEmpty(key))
                return;
            _httpContextAccessor.HttpContext.Session.Remove(key);
        }




        #endregion
    }
}
