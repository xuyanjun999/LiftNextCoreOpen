using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LiftNext.Framework.Data.Repository;

namespace LiftNext.Framework.Domain.Service
{
    public interface IServiceBase
    {
        /// <summary>
        /// 存储操作对象
        /// </summary>
        IRepositoryBase Repository { get; set; }
    }
}
