using System;
using System.Collections.Generic;
using System.Text;

namespace LiftNext.Framework.Code.Util
{
    public class DbUtil
    {
        public static bool IsSqlServer(string conn)
        {
            return !conn.ToLower().Contains("utf-8");
        }

        public static bool IsMySql(string conn)
        {
            return conn.ToLower().Contains("utf-8");
        }
    }
}
