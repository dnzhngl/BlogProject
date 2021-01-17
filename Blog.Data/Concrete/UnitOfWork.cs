using Blog.Data.Abstract;
using Blog.Data.Concrete.EntityFramework.Contexts;
using Blog.Data.Concrete.EntityFramework.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Data.Concrete
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BlogContext _context;
        private EfArticleRepository _articleRepo;
        private EfCategoryRepository _categoryRepo;
        private EfCommentRepository _commentRepo;
        private EfRoleRepository _roleRepo;
        private EfUserRepository _userRepo;

        public UnitOfWork(BlogContext context)
        {
            _context = context;
        }

        public IArticleRepository Articles => _articleRepo ?? new EfArticleRepository(_context);

        public ICategoryRepository Categories => _categoryRepo ?? new EfCategoryRepository(_context);

        public ICommentRepository Comments => _commentRepo ?? new EfCommentRepository(_context);

        public IRoleRepository Roles => _roleRepo ?? new EfRoleRepository(_context);

        public IUserRepository Users => _userRepo ?? new EfUserRepository(_context);

        public async ValueTask DisposeAsync()
        {
            await _context.DisposeAsync();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
