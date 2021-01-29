using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Entities.Dtos
{
    public class ImageUploadedDto
    {
        public string FullName { get; set; }    
        public string PictureName { get; set; }    
        public string OldName { get; set; } // adı değiştiyse eski adı
        public string Entension { get; set; }   // resmin uzantısı
        public string Path { get; set; }    // bulunduğu klasörün yolu
        public string FolderName { get; set; }  // Bulunduğu klasörün adı
        public long Size { get; set; }  // Resmin boyutu
    }
}
