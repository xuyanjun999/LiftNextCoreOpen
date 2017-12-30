using System;
using System.Collections.Generic;
using System.Text;

namespace LiftNext.Framework.Code.Web
{
    public interface IWebHelper
    {
        #region Session操作
        /// <summary>
        /// 写Session
        /// </summary>
        /// <typeparam name="T">Session键值的类型</typeparam>
        /// <param name="key">Session的键名</param>
        /// <param name="value">Session的键值</param>
        void WriteSession<T>(string key, T value);

        /// <summary>
        /// 写Session
        /// </summary>
        /// <param name="key">Session的键名</param>
        /// <param name="value">Session的键值</param>
         void WriteSession(string key, string value);

        /// <summary>
        /// 读取Session的值
        /// </summary>
        /// <param name="key">Session的键名</param>        
         string GetSession(string key);

        /// <summary>
        /// 读取Session的值
        /// </summary>
        /// <param name="key">Session的键名</param>        
         T GetSession<T>(string key);

        /// <summary>
        /// 获取当前用户
        /// </summary>
        /// <param name="key">获取当前用户</param>        
         User GetUser();


        /// <summary>
        /// 获取当前用户
        /// </summary>
        /// <param name="key">获取当前用户</param>        
        void SetUser(User user);

        /// <summary>
        /// 移除当前用户
        /// </summary>
        /// <param name="key">移除当前用户</param>        
         void RemoveUser();

        /// <summary>
        /// 删除指定Session
        /// </summary>
        /// <param name="key">Session的键名</param>
         void RemoveSession(string key);
        #endregion
    }
}
