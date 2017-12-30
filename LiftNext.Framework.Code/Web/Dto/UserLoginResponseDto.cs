using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Code.Web.Dto
{
    public class UserLoginResult
    {
        public long ID { get; set; }
        public string LoginName { get; set; }

        public string Name { get; set; }

        public string Token { get; set; }

        public string Email { get; set; }

        public string LastLogin { get; set; }

        public int CompanyID { get; set; }

        public string Dept { get; set; }
        public string Company { get; set; }
        public string Region { get; set; }

        public bool IsSuperAdmin { get; set; }
        public List<Menu> Menus { get; set; }
    }

    public class Menu
    {
        public string Text { get; set; }
        public string IconCls { get; set; }
        public string Path { get; set; }
        public bool Leaf { get; set; }

        public string FuncCode { get; set; }

        public bool Right { get; set; }

        public List<Menu> Children { get; set; }
    }


    public class UserLoginResponseDto : ResponseDtoBase
    {
        public UserLoginResult Result { get; set; }
    }
}
