using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LiftNext.Framework.Code.Web
{
    public class User
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }

        public string Email { get; set; }

        public int DeptID { get; set; }

        public string DeptName { get; set; }

        public string DeptCode { get; set; }

        public int CompanyID { get; set; }

        public string CompanyCode { get; set; }

        public string CompanyName { get; set; }
        public string CompanyShortCode { get; set; }

        public string Token { get; set; }

        public string LastLogin { get; set; }

        public string Region { get; set; }

        public List<int> ReadedMessageIds { get; set; }

        public bool IsSuperAdmin { get; set; }
        public bool IsAdmin { get; set; }
        public List<Menu> Menus { get; set; }
    }
    public class Menu
    {
        public string Text { get; set; }
        public string IconCls { get; set; }
        public string Path { get; set; }
        public bool Leaf { get; set; }

        public List<Menu> Children { get; set; }
    }
}
