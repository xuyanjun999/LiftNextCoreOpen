using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LiftNext.Framework.Mvc.Areas.Sys.Models
{
    public class SendUpdateMessageModel
    {
        public string Title { get; set; }
        public string Content { get; set; }

        public int Minute { get; set; }
    }
}
