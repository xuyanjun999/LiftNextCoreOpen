using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LiftNext.Framework.Data.Repository;
using Microsoft.Extensions.Logging;

namespace LiftNext.Framework.Service
{
    public class ServiceBase
    {

        /// <summary>
        /// 存储操作对象
        /// </summary>
        public IRepositoryBase Repository { get; set; }


    }
}
