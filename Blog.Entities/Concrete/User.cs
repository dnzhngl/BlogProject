using Blog.Shared.Entities.Abstract;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Entities.Concrete
{
    public class User : IdentityUser<int>
    {
        #region Before ASP.NET CORE Identity 
        //public string Firstname { get; set; }
        //public string Lastname { get; set; }
        //public string Email { get; set; }
        //public byte[] PasswordHash { get; set; }
        //public string Username { get; set; }
        //public string Description { get; set; }

        //public int RoleId { get; set; }
        //public Role Role { get; set; }
        #endregion

        public string Picture { get; set; }
        public ICollection<Article> Articles { get; set; }
    }
}
