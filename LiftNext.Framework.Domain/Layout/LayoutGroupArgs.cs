using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Layout
{

    public class LayoutGroupArgs
    {
        public LayoutGroupArgs()
        {
            Items = new List<LayoutItemArgs>();
        }
        public string Code { get; set; }
        public string Text { get; set; }
        public List<LayoutItemArgs> Items { get; set; }
    }
}
