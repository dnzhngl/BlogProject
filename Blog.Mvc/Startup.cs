using AutoMapper;
using Blog.Mvc.AutoMapper.Profiles;
using Blog.Mvc.Helpers.Abstract;
using Blog.Mvc.Helpers.Concrete;
using Blog.Services.AutoMapper.Profiles;
using Blog.Services.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
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

        public IConfiguration Configuration { get; } //ConnectionStringi appsettings.json'dan çekebilmek için
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddRazorRuntimeCompilation().AddJsonOptions(opt =>
            {
                opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve; // Nested objelerin gelmesi için ekleniyor. 
            }).AddNToastNotifyToastr(); //Bu projenin bir mvc projesi olduğunu belirtir. Sonuna Eklemiş olduğumuz JsonOptions sayesinde modellerimizi Json formatında dönebileceğiz. .NET 5 ile gelen bir özellik bu sayede 3. parti extensionlara ihtiyacımız olmadan Json dönüşümünü sağlayabiliyoruz. // Sona eklediğimiz AddNToastNotifyToastr Notify paketinin kullanımı için eklenen servis.


            services.AddSession(); //Session kullanıcı sitemize giriş yaptığı anda server'da oluşturulan bir oturumdur. Burada servisler arasına session yapısını eklemek istediğimizi söylüyoruz.

            services.AddAutoMapper(typeof(CategoryProfile), typeof(ArticleProfile), typeof(UserProfile), typeof(ViewModelsProfile), typeof(CommentProfile));    //Derlenme esnasında AutoMapperın buradaki sınıfları taramasını sağlıyor. IMapper ve Profile sınıflarını bulup buraya ekliyor.

            services.LoadMyService(connectionString: Configuration.GetConnectionString("LocalDB"));   // parametre olarak appsettings.json dosyasında connectionstring'e vermiş olduğumuz adı veririz.
            // Service injection'ını ServiceCollectionExtension'dan çeker.


            services.AddScoped<IImageHelper, ImageHelper>(); // image helper servisimizi kayediyoruz
            // Cookie işlemleri - ConfigureApplication cookie servisini kullanacağız. Ayarlarını lambda ile giriyoruz.
            services.ConfigureApplicationCookie(options =>
            {       // Projemizde sadece Admin area'ya kullanıcı girişi yapılacağı için adreslerimiz admin area içerisinde yer alıyor.
                options.LoginPath = new PathString("/Admin/User/Login");     // LoginPath = Login işlemlerini gerçekleştireceğimiz sayfanın adresi
                options.LogoutPath = new PathString("/Admin/User/Logout");   // LogoutPath = Logout işlemlerini gerçekleştireceğimiz sayfanın adresi
                
                // Cookie ayarlarını burada giriyoruz.
                options.Cookie = new CookieBuilder
                {
                    Name = "Blog",      // Cookie'nin adı, verilen cookinin nereden geldiği (hangi siteden geldiği gibi)
                    HttpOnly = true,      // Güvenlik sebebi ile true olarak belirlenir. Cookie işlemlerini sadece http üzerinden gönderilmesini sağlıyor, yani bu işlemler server-side'ta yapılıyor. Ve Javascript tarafında yani fronetend tarafında herhangi bir kullanıcının bizim cookie bilgilerimize erişmesini engellemiş oluyoruz. XSS(Cross Site Scripting) saldırıları -  Bunu yapmadığımızda, kullanıcı sadece bir kaç satır javascript kodu ile bizlerin cookie bilgilerini görebiliyor.
                    SameSite = SameSiteMode.Strict, // SameSiteMode.Strict =>  Cookie bilgileri sadece kendi sitemizden geldiğinde işlenmesini sağlar. 
                    // O an oturum açmış olan kullanıcının cookie bilgilerinin farkında olmadan kullanılarak yapılan işlemlerdir. Örneğin ben bir giriş yaptım ve benim cookie bilgilerim çalındı. Saldırgan sanki ben bir istek yapmışım gibi benim cookie bilgilerimi kullanarak server'a istek gönderip işlem yapabiliyor.
                    // Özellikle Cross Site Request Forgery ( CSRF) / Siteler Arası İstek Sahtekarlığı : web uygulamasını kullanmakta olan kullanıcıların istekleri dışında işlemler yürütülmesidir. Uygulamaya giden isteklerin hangi kaynaktan ve nasıl gönderildiği kontrol edilmeyen sistemlerde ortaya çıkar. Genelde CSRF veya XSRF şeklinde kısaltılan bu güvenlik açığı "Session Riding" olarak da bilinmektedir.
                    SecurePolicy = CookieSecurePolicy.SameAsRequest // Cookinin güvenlik değerini vermiş oluyoruz. SameAsRequest => istek bize http üzerinden gelirse http, https üzerinden gelirse https üzerinden dönüş yapıyor olacak. Gerçek projelerde kullanımı "Always"'dir => yani ne olursa olsun https üzerinden bu bilgilerin aktarılmasıdır. None veya SameAsRequest olarak bırakırsanız bu bir güvenlik açığıdır.
                };

                options.SlidingExpiration = true; // Kullanıcı sitemize giriş yaptıktan sonra zaman kullanıcıya bir zaman tanıyoruz. Bu süre içerisinde kullanıcı tekrardan giriş yaparsa tanınan zaman başa sarar. 
                options.ExpireTimeSpan = System.TimeSpan.FromDays(7);  // Kullanıcıya verilen cookie bilgileri 7 gün boyunca etkili olacak tarayıcı üzerinde. 7 gün içerisinde giriş yapmaz ise cookie bilgileri geçersiz olacak.
                options.AccessDeniedPath = new PathString("/Admin/User/AccessDenied");  // Kullanıcı sisteme giriş yapmış ama yetkisi olmayan bir sayfaya erişmeye çalıştığında kullanıcıyı hangi sayfaya yönlendireceğini veriyorsun.
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseStatusCodePages();   // Sitemizde bulunmayan bir sayfaya gitmeye kalktığımızda 404 not found döner.
            }
            app.UseSession(); // Development kontrolü geçtikçen sonra, serverda bir session oluşmasını istediğimiz için bunu burada belirtiyoruz. Session yapısını Authentication ve Authorization yapısından önce belirtmemiz gerekiyor çünkü o yağılarda session yapısını kullanıyor.

            app.UseStaticFiles();   //Static dosyaları kullanmamızı sağlar.Resimler Css dosyaları veya js dosyaları gibi.
            app.UseRouting();

            // Buraya eklememizin sebebi: önclikle hangi route(hangi adrese gitmek istiyorsa kişi) üzerinden işlem yapacağımızı biliyor olmamız gerekiyor ki sonrasında bu işlemleri gerçekleştirelim.
            // Örn. projemizde Admin area'ya sadece kimlik doğrulamasından geçen ve yetkisi olan kullanıcılar erişebilecek. 
            app.UseAuthentication();    // Kimlik doğrulaması
            app.UseAuthorization();     // Yetki kontrolü

            app.UseNToastNotify(); //NToastNotify eklentisi

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


/* 1.Authentication -> Kimlik Doğrulaması
    İstenilen sayfalara sadece sisteme kayıtlı olan ve giriş yapmış olan kullanıcıların erişmesini sağlar

   2. Authorization -> Yetki Kontrolü
     Hangi sayfayı/bilgiyi kim görebilir? (Admins Only)
*/

/* Sessin nedir?
    Session kullanıcı sitemize giriş yaptığı anda server'da oluşturulan bir oturumdur.
    Bunu bir global değişken olarak düşünebiliriz. Ve kullanıcının bu session durumu devam ettiği sürece de bizler burada kullanıcıyla ilgili bilgiler saklayabiliyoruz. 
*/