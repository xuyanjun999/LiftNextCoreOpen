using LiftNext.Framework.Code.Web;
using LiftNext.Framework.Data.Context;
using LiftNext.Framework.Data.Repository;
using LiftNext.Framework.Data.SQL;
using LiftNext.Framework.Domain.Entity.Sys;
using LiftNext.Framework.Domain.Service.Sys;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LiftNext.Framework.Service.Sys
{
    /// <summary>
    /// 自动编号服务
    /// </summary>
    public class AutoNumberService : ServiceBase, IAutoNumberService
    {

        static object SYNC_OBJ = new object();

        static readonly string NO_KEY = "not defined";


        private readonly ILogger<AutoNumberService> Log;


        private readonly IIndependentRepository IndependentRepository;

        public AutoNumberService(ILogger<AutoNumberService> logger, IRepositoryBase repository, IIndependentRepository independentRepository,ISQLBuilder sqlBuilder, IWebHelper webHelper)
        {
            this.Log = logger;
            this.Repository = repository;
            this.IndependentRepository = independentRepository;
        }


      

        public string MakeAutoNumber(string key)
        {
            try
            {
                Monitor.Enter(SYNC_OBJ);

                var autoNumber = IndependentRepository.QueryFirst<AutoNumberEntity>(x => x.Key == key);
                if (autoNumber == null) return NO_KEY;

                return MakeNextNumber(autoNumber);
            }
            finally
            {
                Monitor.Exit(SYNC_OBJ);
            }
        }


        public string MakeAutoNumber(string key, string group, string pref, AutoNumberResetModeEnum resetMode, int numDigit = 4)
        {
            try
            {
                Monitor.Enter(SYNC_OBJ);
                var autoNumber = IndependentRepository.QueryFirst<AutoNumberEntity>(x => x.Key == key && x.Group == group);
                if (autoNumber == null)
                {
                    autoNumber = new AutoNumberEntity()
                    {
                        Key = key,
                        Group = group,
                        AutoNumbeResetModeEnum = resetMode,
                        NumDigit = numDigit
                    };
                    IndependentRepository.Insert(autoNumber);
                }
                return MakeNextNumber(autoNumber, pref);
            }
            finally
            {
                Monitor.Exit(SYNC_OBJ);
            }
        }

        public string MakeAutoNumber(string key, string pref)
        {
            try
            {
                Monitor.Enter(SYNC_OBJ);
                var autoNumber = IndependentRepository.QueryFirst<AutoNumberEntity>(x => x.Key == key);
                if (autoNumber == null) return NO_KEY;
                return MakeNextNumber(autoNumber, pref);
            }
            finally
            {
                Monitor.Exit(SYNC_OBJ);
            }
        }

        string MakeNextNumber(AutoNumberEntity autoNumber, string pref = "")
        {
            DateTime lastUpdateTime = autoNumber.UpdateOn;
            DateTime now = DateTime.Now;
            switch (autoNumber.AutoNumbeResetModeEnum)
            {
                case AutoNumberResetModeEnum.Year:
                    if (lastUpdateTime.Year != now.Year) autoNumber.Num = 1;
                    else autoNumber.Num++;
                    break;
                case AutoNumberResetModeEnum.Month:
                    if (lastUpdateTime.Year != now.Year || lastUpdateTime.Month != now.Month) autoNumber.Num = 1;
                    else autoNumber.Num++;
                    break;
                case AutoNumberResetModeEnum.Day:
                    if (lastUpdateTime.Year != now.Year || lastUpdateTime.Month != now.Month || lastUpdateTime.Day != now.Day) autoNumber.Num = 1;
                    else autoNumber.Num++;
                    break;
            }

            IndependentRepository.Update<AutoNumberEntity>(autoNumber, x => x.Num);

            if (string.IsNullOrEmpty(pref))
            {
                return string.Format("{0}{1}{2}", autoNumber.Pref, now.ToString(autoNumber.DateFormat), autoNumber.Num.ToString().PadLeft(autoNumber.NumDigit, '0'));
            }
            else
            {
                return string.Format("{0}{1}", pref, autoNumber.Num.ToString().PadLeft(autoNumber.NumDigit, '0'));
            }

        }
    }
}
