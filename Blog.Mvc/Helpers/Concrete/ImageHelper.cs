using Blog.Entities.Dtos;
using Blog.Mvc.Helpers.Abstract;
using Blog.Shared.Utilities.Extensions;
using Blog.Shared.Utilities.Results.Abstract;
using Blog.Shared.Utilities.Results.ComplexTypes;
using Blog.Shared.Utilities.Results.Concrete;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Blog.Mvc.Helpers.Concrete
{
    public class ImageHelper : IImageHelper
    {
        private readonly IWebHostEnvironment _env;
        private readonly string _wwwroot;
        private readonly string imgFolder = "img";

        public ImageHelper(IWebHostEnvironment env)
        {
            _env = env;
            _wwwroot = _env.WebRootPath; // wwroot dosya yolunu dinamik bir şekilde verir.
        }

        public IDataResult<ImageDeletedDto> Delete(string pictureName, string folderName)
        {
            var fileToDelete = Path.Combine($"{_wwwroot}\\{imgFolder}\\{folderName}\\", pictureName);
            if (System.IO.File.Exists(fileToDelete))
            {
                var fileInfo = new FileInfo(fileToDelete);
                var imageDeletedDto = new ImageDeletedDto
                {
                    FullName = pictureName,
                    Extension = fileInfo.Extension,
                    Path = fileToDelete,  // fileInfo.FullName
                    Size = fileInfo.Length
                };
                System.IO.File.Delete(fileToDelete);
                return new DataResult<ImageDeletedDto>(ResultStatus.Success, imageDeletedDto);
            }
            else
            {
                return new DataResult<ImageDeletedDto>(ResultStatus.Error, "Böyle bir resim bulunamadı.", null);
            }
        }

        public async Task<IDataResult<ImageUploadedDto>> UploadUserImage(string userName, IFormFile pictureFile, string folderName = "userImg")
        {
            if (!Directory.Exists($"{_wwwroot}/{imgFolder}/{folderName}")) //parametre olarak gönderilen folderName yani bu dosya adında bir dosya mevcut mu ona bakıyoruz.
            {
                Directory.CreateDirectory($"{_wwwroot}/{imgFolder}/{folderName}"); // Mevcut değilse gelen dosya adında bir dosya oluşturuyoruz.
            }
            string oldFileName = Path.GetFileNameWithoutExtension(pictureFile.FileName); // kullanıcının eklemiş olduğu dosya adı.
            string fileExtension = Path.GetExtension(pictureFile.FileName);
            DateTime dateTime = DateTime.Now;

            string newFileName = $"{userName}_{dateTime.FullDateAndTimeStringWithUnderscore()}{fileExtension}";   // JamesBond_601_5_38_12_3_10_2020.png şeklinde resim adı oluşturuyoruz.
            var path = Path.Combine($"{_wwwroot}/{imgFolder}/{folderName}", newFileName); // dosyanın kaydedileceği yol ve dosyanın adı path'e atanır. --> wwroot/img/userImg/resim.png   

            await using (var stream = new FileStream(path, FileMode.Create))
            {
                await pictureFile.CopyToAsync(stream); // resmi kaydetme - FileStream : dosyalarla ilgili işlemleri yöneten bir class
            }
            return new DataResult<ImageUploadedDto>(ResultStatus.Success, $"{userName} adlı kullanıcının resmi başarıyla yüklenmiştir.", new ImageUploadedDto
            {
                FullName = $"{folderName}/{newFileName}", // foldername'in sürekli değişme ihtimali olduğu için full name'i resmin bulunduğu dosya adıyla beraber döndürdük.
                PictureName = newFileName,
                OldName = oldFileName,
                Entension = fileExtension,
                FolderName = folderName,
                Path = path,
                Size = pictureFile.Length // .lenght resim kaç kb yada mb ise bunu long türünde return eder
            });
        }
    }
}
