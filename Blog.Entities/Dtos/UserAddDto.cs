using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Entities.Dtos
{
    public class UserAddDto
    {
        [DisplayName("Kullanıcı Adı")]
        [Required(ErrorMessage = "{0} boş bırakılmamalıdır.")]
        [MaxLength(50, ErrorMessage = "{0} {1} karakterden fazla olamamalıdır.")]
        [MinLength(3, ErrorMessage = "{0} {1} karakterden az olamamalıdır.")]
        public string UserName { get; set; }

        [DisplayName("E-mail Adresi")]
        [Required(ErrorMessage = "{0} boş bırakılmamalıdır.")]
        [MaxLength(100, ErrorMessage = "{0} {1} karakterden fazla olamamalıdır.")]
        [MinLength(10, ErrorMessage = "{0} {1} karakterden az olamamalıdır.")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [DisplayName("Şifre")]
        [Required(ErrorMessage = "{0} boş bırakılmamalıdır.")]
        [MaxLength(30, ErrorMessage = "{0} {1} karakterden fazla olamamalıdır.")]
        [MinLength(5, ErrorMessage = "{0} {1} karakterden az olamamalıdır.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DisplayName("Telefon Numarası")]
        [Required(ErrorMessage = "{0} boş bırakılmamalıdır.")]
        [MaxLength(13, ErrorMessage = "{0} {1} karakterden fazla olamamalıdır.")] // +905555555 - 13 characters
        [MinLength(13, ErrorMessage = "{0} {1} karakterden az olamamalıdır.")]
        [DataType(DataType.PhoneNumber)]
        public string PhoneNumber { get; set; }


        [DisplayName("Resim")]
        [Required(ErrorMessage = "Lütfen bir {0} seçiniz.")]
        [DataType(DataType.Upload)]
        public IFormFile PictureFile { get; set; }

        public string Picture { get; set; } // Dosyanın adını saklamak için kullanılacak alan
    }
}
