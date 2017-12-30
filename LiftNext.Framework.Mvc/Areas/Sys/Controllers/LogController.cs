using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Domain.Entity.Sys;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LiftNext.Framework.Mvc.Areas.Sys.Controllers
{
    public class LogController :MyController<LogEntity>
    {


        private readonly ILogger<LogController> Log;

        public LogController(ILogger<LogController> logger, IRepositoryBase repository)
        {
            this.Log = logger;
            this.Repository = repository;
        }
    }
}