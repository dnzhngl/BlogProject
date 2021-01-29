using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Entities.Dtos
{
    public class UserLoginDto
    {
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

        [DisplayName("Beni Hatırla")]
        public bool RememberMe { get; set; }
    }
}
