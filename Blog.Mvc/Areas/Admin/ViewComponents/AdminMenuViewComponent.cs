using Blog.Entities.Concrete;
using Blog.Mvc.Areas.Admin.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Blog.Mvc.Areas.Admin.ViewComponents
{
    public class AdminMenuViewComponent : ViewComponent
    {
        private readonly UserManager<User> _userManager;

        public AdminMenuViewComponent(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // Invoke metodu içerisinde aynı bir controllerda view return eder gibi istersek veri tabanı ile iletişim kurabilir, istersek de farklı işlemler yapabiliriz. View'i returnlemeden önce bir model kullanma yada hesaplamalar yapma imkanı sağlar.
        public ViewViewComponentResult Invoke() 
        {
            var user = _userManager.GetUserAsync(HttpContext.User).Result; // Hangi kullanıcı login olmuş ise onu getirmek için HttpContext.User'ı kullanıyoruz.
            var roles = _userManager.GetRolesAsync(user).Result;    //roller
            return View(new UserWithRolesViewModel
            {
                User = user,
                Roles = roles
            });
        }
    }
}
