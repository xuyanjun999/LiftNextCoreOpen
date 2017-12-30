using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Code.Web.Dto
{
    public class EntityResponseDto : ResponseDtoBase
    {
        public EntityResponseDto()
        {
            Result = new Dictionary<string, object>();
        }
        public int Count { get; set; }

        public Dictionary<string, object> Result { get; set; }
    }
}
