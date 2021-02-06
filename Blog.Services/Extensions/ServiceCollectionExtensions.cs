using Blog.Data.Abstract;
using Blog.Data.Concrete;
using Blog.Data.Concrete.EntityFramework.Contexts;
using Blog.Entities.Concrete;
using Blog.Services.Abstract;
using Blog.Services.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Services.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection LoadMyService(this IServiceCollection serviceCollection, string connectionString)
        {
            // connectionStringi appsettings.Development.json'dan alır.
            serviceCollection.AddDbContext<BlogContext>(options => options.UseSqlServer(connectionString));


             //ASP.NET CORE Identity yapısını kullanabilmek için buraya configurasyon eklemeliyiz. Bunun içinde öncelikle AspNetCore.Identity Nugeti kurulur.
            serviceCollection.AddIdentity<User, Role>(options => 
            {
                // User Password Options
                options.Password.RequireDigit = false; // Rakam içersin mi?
                options.Password.RequiredLength = 5;    // Uzunluğu kaç karakter olsun?
                options.Password.RequiredUniqueChars = 0; // Şifrede unique character'lerden birbirinden farklı kaç tane olmalı?
                options.Password.RequireNonAlphanumeric = false; // ?, !, @, $ gibi özel karakterler kullanılsın mı?
                options.Password.RequireLowercase = false; // Küçük harf içersin mi?
                options.Password.RequireUppercase = false; // büyük harf içersin mi?

                //User Username and Email Options
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ "; // Kullanıcı adında kullanılmasına izin verdiğin tüm karakterleri gir.
                options.User.RequireUniqueEmail = true; // Kullanıcı kaydolurken girdiği email adresinden sistemde sadece bir tane olmasına izin verir.

            }).AddEntityFrameworkStores<BlogContext>();

            serviceCollection.AddScoped<IUnitOfWork, UnitOfWork>();
            serviceCollection.AddScoped<ICategoryService, CategoryManager>();
            serviceCollection.AddScoped<IArticleService, ArticleManager>();
            serviceCollection.AddScoped<ICommentService, CommentManager>();

            return serviceCollection;
        }
    }
}
