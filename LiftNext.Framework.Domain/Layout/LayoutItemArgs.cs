using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Layout
{
    public class LayoutItemArgs
    {
        public string GroupName { get; set; }
        public string GroupCode { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }
        public int Index { get; set; }
        public string Xtype { get; set; }
        public bool Hold { get; set; }
    }
}
