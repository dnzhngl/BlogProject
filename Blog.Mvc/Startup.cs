using AutoMapper;
using Blog.Services.AutoMapper.Profiles;
using Blog.Services.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Blog.Mvc
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddRazorRuntimeCompilation().AddJsonOptions(opt =>
            {
                opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve; // Nested objelerin gelmesi için ekleniyor. 
            }); //Bu projenin bir mvc projesi olduğunu belirtir. Sonuna Eklemiş olduğumuz JsonOptions sayesinde modellerimizi Json formatında dönebileceğiz. .NET 5 ile gelen bir özellik bu sayede 3. parti extensionlara ihtiyacımız olmadan Json dönüşümünü sağlayabiliyoruz.
            services.AddAutoMapper(typeof(CategoryProfile), typeof(ArticleProfile));    //Derlenme esnasında AutoMapperın buradaki sınıfları taramasını sağlıyor. IMapper ve Profile sınıflarını bulup buraya ekliyor.
            services.LoadMyService();   // Service injectionını ServiceCollectionExtension'dan çeker.
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseStatusCodePages();   // Sitemizde bulunmayan bir sayfaya gitmeye kalktığımızda 404 not found döner.
            }

            app.UseStaticFiles();   //Static dosyaları kullanmamızı sağlar.Resimler Css dosyaları veya js dosyaları gibi.
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapAreaControllerRoute(
                    name: "Admin",
                    areaName: "Admin",
                    pattern: "Admin/{controller=Home}/{action=Index}/{id?}"
                );
                endpoints.MapDefaultControllerRoute(); //Varsayılan olarak HomeCnotroller Index'e gider.
            });
        }
    }
}
