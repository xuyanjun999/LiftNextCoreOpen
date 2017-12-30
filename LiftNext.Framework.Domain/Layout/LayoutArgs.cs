using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Domain.Layout
{

    public class LayoutArgs
    {
        public LayoutArgs()
        {
            Groups = new List<LayoutGroupArgs>();
            Params = new List<LayoutParamArgs>();
        }

        public bool Default { get; set; }
        public int ID { get; set; }
        public int Owner { get; set; }
        public int UseType { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }
        public List<LayoutGroupArgs> Groups { get; set; }

        public List<LayoutParamArgs> Params { get; set; }
        public string LayoutContent { get; set; }
    }
}
