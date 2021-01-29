using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Entities.Dtos
{
    public class UserPasswordChangeDto
    {
        [DisplayName("Geçerli Şifre")]
        [Required(ErrorMessage = "{0} boş bırakılmamalıdır.")]
        [MaxLength(30, ErrorMessage = "{0} {1} karakterden fazla olamamalıdır.")]
        [MinLength(5, ErrorMessage = "{0} {1} karakterden az olamamalıdır.")]
        [DataType(DataType.Password)]
        public string CurrentPassword { get; set; }

        [DisplayName("Yeni Şifre")]
        [Required(ErrorMessage = "{0} boş bırakılmamalıdır.")]
        [MaxLength(30, ErrorMessage = "{0} {1} karakterden fazla olamamalıdır.")]
        [MinLength(5, ErrorMessage = "{0} {1} karakterden az olamamalıdır.")]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [DisplayName("Yeni Şifrenin Tekrarı")]
        [Required(ErrorMessage = "{0} boş bırakılmamalıdır.")]
        [MaxLength(30, ErrorMessage = "{0} {1} karakterden fazla olamamalıdır.")]
        [MinLength(5, ErrorMessage = "{0} {1} karakterden az olamamalıdır.")]
        [DataType(DataType.Password)]
        [Compare("NewPassword", ErrorMessage = "Girmiş olduğunuz yeni şifre ve yeni şifrenin tekrarı birbiriyle uyuşmalıdır.")]
        public string RepeatPassword { get; set; }
    }
}
