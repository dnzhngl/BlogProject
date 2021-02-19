using AutoMapper;
using Blog.Entities.Concrete;
using Blog.Mvc.Helpers.Abstract;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blog.Mvc.Areas.Admin.Controllers
{
    public class BaseController : Controller
    {
        public BaseController(UserManager<User> userManager, IMapper mapper, IImageHelper imageHelper)
        {
            UserManager = userManager;
            Mapper = mapper;
            ImageHelper = imageHelper;
        }

        protected UserManager<User> UserManager { get;  }
        protected User LoggedInUser => UserManager.GetUserAsync(HttpContext.User).Result; // Login olmuş olan userın bilgilsine erişmek için LoggedInUser kullanmamız yeterli olacak.
        protected IMapper Mapper { get; }
        protected IImageHelper ImageHelper { get; }
    }
}
