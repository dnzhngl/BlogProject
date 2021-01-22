using Blog.Shared.Entities.Abstract;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Entities.Concrete
{
    public class Role : IdentityRole<int>
    {
        //public string Name { get; set; }
        //public string Description { get; set; }

        //public ICollection<User> Users { get; set; }
    }
}
