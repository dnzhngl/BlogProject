using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Data.Abstract
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        IArticleRepository Articles { get; }
        ICategoryRepository Categories { get; }  
        ICommentRepository Comments { get; }

        // .NET Core Identity Yapısını projemize dahil ettiğimiz için kendi oluşturduğumuz bu yapılara ihtiyacımız kalmadı.
        //IRoleRepository Roles { get; }
        //IUserRepository Users { get; }  
        
        //_unitOfWork.Categories.AddAsync(category);
        //_unitOfWork.Users.AddAsync(user);
        //_unitOfWork.SaveAsync();

        Task<int> SaveAsync();
    }
}
