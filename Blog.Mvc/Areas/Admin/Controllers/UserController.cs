﻿using AutoMapper;
using Blog.Entities.ComplexTypes;
using Blog.Entities.Concrete;
using Blog.Entities.Dtos;
using Blog.Mvc.Areas.Admin.Models;
using Blog.Mvc.Helpers.Abstract;
using Blog.Shared.Utilities.Extensions;
using Blog.Shared.Utilities.Results.ComplexTypes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NToastNotify;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Blog.Mvc.Areas.Admin.Controllers
{
    [Area("Admin")] //UserController'ın Admin area için çalıştığını belirtiyoruz.
    public class UserController : BaseController
    {
       
        private readonly SignInManager<User> _signInManager;       
        private readonly IToastNotification _toastNotification; //NToastNotify 

        public UserController(UserManager<User> userManager, IMapper mapper, SignInManager<User> signInManager, IImageHelper imageHelper, IToastNotification toastNotification) : base(userManager, mapper, imageHelper)
        {
            _signInManager = signInManager;
            _toastNotification = toastNotification;
        }

        [Authorize(Roles = "SuperAdmin, User.Read")]
        public async Task<IActionResult> Index()
        {
            var result = await UserManager.Users.ToListAsync();
            return View(new UserListDto
            {
                Users = result,
                ResultStatus = ResultStatus.Success
            });
        }


        [Authorize(Roles = "SuperAdmin, User.Create")]
        [HttpGet]
        public IActionResult Add()
        {
            return PartialView("_UserAddPartial");
        }
        [Authorize(Roles = "SuperAdmin, User.Create")]
        [HttpPost]
        public async Task<IActionResult> Add(UserAddDto userAddDto)
        {
            if (ModelState.IsValid)
            {
                //userAddDto.Picture = await ImageUpload(userAddDto.UserName, userAddDto.PictureFile); -- before ImageHelper
                //var uploadedImageDtoResult = await ImageHelper.UploadUserImage(userAddDto.UserName, userAddDto.PictureFile); // Before Upload method in image helper revized.
                var uploadedImageDtoResult = await ImageHelper.Upload(userAddDto.UserName, userAddDto.PictureFile, PictureType.User);
                userAddDto.Picture = uploadedImageDtoResult.ResultStatus == ResultStatus.Success
                    ? uploadedImageDtoResult.Data.PictureName : "defaultUser.png";

                var user = Mapper.Map<User>(userAddDto);
                // userManager .Net core Identity ile birlikte geliyor biz özel olarak oluşturmadık. 
                var result = await UserManager.CreateAsync(user, userAddDto.Password); // IdentityResult dönüyor
                if (result.Succeeded)
                {
                    var userAddAjaxModel = JsonSerializer.Serialize(new UserAddAjaxViewModel
                    {
                        UserDto = new UserDto
                        {
                            ResultStatus = ResultStatus.Success,
                            Message = $"{user.UserName} adlı kullanıcı başarıyla eklenmiştir.",
                            User = user
                        },
                        UserAddPartial = await this.RenderViewToStringAsync("_UserAddPartial", userAddDto) // Partial View'i model bilgisiyle beraber stringe çevirdik.
                    });
                    return Json(userAddAjaxModel);
                }
                else // Identity Result Succeeded dönmezse
                {
                    foreach (var error in result.Errors)    // result içerisindeki her bir hata için işlem yaptık.
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                    var userAddAjaxErrorModel = JsonSerializer.Serialize(new UserAddAjaxViewModel
                    {
                        UserAddDto = userAddDto,
                        UserAddPartial = await this.RenderViewToStringAsync("_UserAddPartial", userAddDto)
                    });
                    return Json(userAddAjaxErrorModel);
                }
            }
            // ModelState Valid değil ise;
            var userAddAjaxModelStateErrorModel = JsonSerializer.Serialize(new UserAddAjaxViewModel
            {
                UserAddDto = userAddDto,
                UserAddPartial = await this.RenderViewToStringAsync("_UserAddPartial", userAddDto)
            });
            return Json(userAddAjaxModelStateErrorModel);
        }

        [Authorize(Roles = "SuperAdmin, User.Read")]
        [HttpGet]
        public async Task<JsonResult> GetAllUsers()
        {
            var result = await UserManager.Users.ToListAsync();
            var userListDto = JsonSerializer.Serialize(new UserListDto
            {
                Users = result,
                ResultStatus = ResultStatus.Success
            }, new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            });
            return Json(userListDto);
        }

        [Authorize(Roles = "SuperAdmin, User.Delete")]
        [HttpPost]
        public async Task<JsonResult> Delete(int userId)
        {
            var user = await UserManager.FindByIdAsync(userId.ToString());
            var result = await UserManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                var deletedUser = JsonSerializer.Serialize(new UserDto
                {
                    User = user,
                    ResultStatus = ResultStatus.Success,
                    Message = $"{user.UserName} adlı kullanıcı başarıyla silinmiştir."
                });
                return Json(deletedUser);
            }
            else
            {
                string errorMessages = String.Empty;
                foreach (var error in result.Errors)
                {
                    errorMessages += $"* {error.Description}\n";
                }
                var deletedUserErrorModel = JsonSerializer.Serialize(new UserDto
                {
                    User = user,
                    ResultStatus = ResultStatus.Error,
                    Message = $"{user.UserName} adlı kullanıcı silinirken hata oluştu. \n{errorMessages}"
                });
                return Json(deletedUserErrorModel);
            }
        }

        [Authorize(Roles = "SuperAdmin, User.Update")]
        [HttpGet]
        public async Task<PartialViewResult> Update(int userId)
        {
            var user = await UserManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var userUpdateDto = Mapper.Map<UserUpdateDto>(user);
            return PartialView("_UserUpdatePartial", userUpdateDto);
        }
        [Authorize(Roles = "SuperAdmin, User.Update")]
        [HttpPost]
        public async Task<IActionResult> Update(UserUpdateDto userUpdateDto)
        {
            if (ModelState.IsValid)
            {
                bool isNewPictureUploaded = false;
                var oldUser = await UserManager.FindByIdAsync(userUpdateDto.Id.ToString());
                var oldUserPicture = oldUser.Picture;
                var folderName = "";
                if (userUpdateDto.PictureFile != null) // Yeni resim eklendi mi?
                {
                    //var uploadedImageDtoResult = await ImageHelper.UploadUserImage(userUpdateDto.UserName, userUpdateDto.PictureFile); //Before Upload method in ImagerHelper class created
                    var uploadedImageDtoResult = await ImageHelper.Upload(userUpdateDto.UserName, userUpdateDto.PictureFile, PictureType.User);
                    userUpdateDto.Picture = uploadedImageDtoResult.ResultStatus == ResultStatus.Success
                        ? uploadedImageDtoResult.Data.PictureName : "defaultUser.png";  // "defaultUser.png"

                    folderName = uploadedImageDtoResult.Data.FolderName;

                    if (oldUserPicture != "defaultUser.png") // "defaultUser.png"
                    {
                        isNewPictureUploaded = true;
                    }

                }

                var updatedUser = Mapper.Map<UserUpdateDto, User>(userUpdateDto, oldUser);
                var result = await UserManager.UpdateAsync(updatedUser);
                if (result.Succeeded)   //kullanıcı başarıyla güncellendiyse
                {
                    if (isNewPictureUploaded)  // Yeni resim eklendiyse eski resmi sistemden sil.
                    {
                        ImageHelper.Delete(oldUserPicture, PictureType.User, folderName);
                    }
                    var userUpdateViewModel = JsonSerializer.Serialize(new UserUpdateAjaxViewModel
                    {
                        UserDto = new UserDto
                        {
                            ResultStatus = ResultStatus.Success,
                            Message = $"{updatedUser.UserName} adlı kullanıcının bilgileri başarıyla güncellenmiştir.",
                            User = updatedUser
                        },
                        UserUpdatePartial = await this.RenderViewToStringAsync("_UserUpdatePartial", userUpdateDto)
                    });
                    return Json(userUpdateViewModel);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                    var userUpdateErrorViewModel = JsonSerializer.Serialize(new UserUpdateAjaxViewModel
                    {
                        UserUpdateDto = userUpdateDto,
                        UserUpdatePartial = await this.RenderViewToStringAsync("_UserUpdatePartial", userUpdateDto)
                    });
                    return Json(userUpdateErrorViewModel);
                }
            }
            else
            {
                var userUpdateModelStateErrorViewModel = JsonSerializer.Serialize(new UserUpdateAjaxViewModel
                {
                    UserUpdateDto = userUpdateDto,
                    UserUpdatePartial = await this.RenderViewToStringAsync("_UserUpdatePartial", userUpdateDto)
                });
                return Json(userUpdateModelStateErrorViewModel);
            }
        }

        [Authorize(Roles = "SuperAdmin, User.Read")]
        [HttpGet]
        public async Task<PartialViewResult> GetDetail(int userId)
        {
            var user = await UserManager.Users.SingleOrDefaultAsync(u => u.Id == userId);
            return PartialView("_GetDetailPartial", new UserDto { User = user });
        }

        [Authorize]
        [HttpGet]
        public async Task<ViewResult> ChangeDetails()
        {
            var user = await UserManager.GetUserAsync(HttpContext.User);
            var userUpdateDto = Mapper.Map<UserUpdateDto>(user);
            return View(userUpdateDto);
        }
        [Authorize]
        [HttpPost]
        public async Task<ViewResult> ChangeDetails(UserUpdateDto userUpdateDto)
        {
            if (ModelState.IsValid)
            {
                bool isNewPictureUploaded = false;
                var oldUser = await UserManager.GetUserAsync(HttpContext.User);
                var oldUserPicture = oldUser.Picture;
                var folderName = "";
                if (userUpdateDto.PictureFile != null) // Yeni resim eklendi mi?
                {
                    //var uploadedImageDtoResult = await ImageHelper.UploadUserImage(userUpdateDto.UserName, userUpdateDto.PictureFile);
                    var uploadedImageDtoResult = await ImageHelper.Upload(userUpdateDto.UserName, userUpdateDto.PictureFile, PictureType.User);
                    userUpdateDto.Picture = uploadedImageDtoResult.ResultStatus == ResultStatus.Success
                        ? uploadedImageDtoResult.Data.PictureName : "defaultUser.png";  // "defaultUser.png"
                    folderName = uploadedImageDtoResult.Data.FolderName;
                    if (oldUserPicture != "defaultUser.png")  // "defaultUser.png"
                    {
                        isNewPictureUploaded = true;
                    }
                }
                var updatedUser = Mapper.Map<UserUpdateDto, User>(userUpdateDto, oldUser);
                var result = await UserManager.UpdateAsync(updatedUser);
                if (result.Succeeded)   //kullanıcı başarıyla güncellendiyse
                {
                    if (isNewPictureUploaded)  // Yeni resim eklendiyse eski resmi sistemden sil. Ancak eski resim default resimse silme.
                    {
                        ImageHelper.Delete(oldUserPicture, PictureType.User, folderName);
                    }

                    //TempData.Add("SuccessMessage", $"{updatedUser.UserName}, kullanıcı bilgileriniz başarıyla güncellenmiştir.");
                    _toastNotification.AddSuccessToastMessage($"{updatedUser.UserName}, kullanıcı bilgileriniz başarıyla güncellenmiştir.");
                    return View(userUpdateDto);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                    return View(userUpdateDto);
                }
            }
            else
            {
                return View(userUpdateDto);
            }
        }

        [Authorize]
        [HttpGet]
        public ViewResult PasswordChange()
        {
            return View();
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PasswordChange(UserPasswordChangeDto userPasswordChangeDto)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.GetUserAsync(HttpContext.User);
                var isVerified = await UserManager.CheckPasswordAsync(user, userPasswordChangeDto.CurrentPassword);
                if (isVerified)
                {
                    var result = await UserManager.ChangePasswordAsync(user, userPasswordChangeDto.CurrentPassword, userPasswordChangeDto.NewPassword);
                    if (result.Succeeded)
                    {
                        await UserManager.UpdateSecurityStampAsync(user);
                        await _signInManager.SignOutAsync();
                        await _signInManager.PasswordSignInAsync(user, userPasswordChangeDto.NewPassword, true, false);
                        //TempData.Add("SuccessMessage", "Şifreniz başarıyla değiştirilmiştir.");
                        _toastNotification.AddSuccessToastMessage("Şifreniz başarıyla değiştirilmiştir.");

                        return View();
                    }
                    else
                    {
                        foreach (var error in result.Errors)
                        {
                            ModelState.AddModelError("", error.Description);
                        }
                        return View(userPasswordChangeDto);
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Lütfen girmiş olduğunuz şu anki şifrenizi kontrol ediniz.");
                    return View(userPasswordChangeDto);
                }
            }
            else
            {
                ModelState.AddModelError("", "Lütfen girmiş olduğunuz şu anki şifrenizi kontrol ediniz.");
                return View(userPasswordChangeDto);
            }
        }
    }
}
