using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Blog.Entities.Concrete;
using Blog.Entities.Dtos;
using Blog.Shared.Utilities.Results.Abstract;

namespace Blog.Services.Abstract
{
    public interface ICategoryService
    {
        Task<IDataResult<CategoryDto>> GetAsync(int categoryId);
        Task<IDataResult<CategoryListDto>> GetAllAsync();
        Task<IDataResult<CategoryListDto>> GetAllByNonDeletedAsync();
        Task<IDataResult<CategoryListDto>> GetAllByNonDeletedAndActiveAsync();

        Task<IDataResult<CategoryDto>> AddAsync(CategoryAddDto categoryAddDto, string createdByName);
        Task<IDataResult<CategoryDto>> UpdateAsync(CategoryUpdateDto categoryUpdateDto, string modifiedByName);
        Task<IDataResult<CategoryDto>> DeleteAsync(int categoryId, string modifiedByName);   //isDeleted değiştirilir
        Task<IResult> HardDeleteAsync(int categoryId);   //veritabanından silmek için

        Task<IDataResult<CategoryUpdateDto>> GetCategoryUpdateDtoAsync(int categoryId); //CategoryUpdate için CategoryUpdateDto türünde return yapacak
        Task<IDataResult<int>> CountAsync();
        Task<IDataResult<int>> CountByNonDeletedAsync();

        Task<IDataResult<CategoryListDto>> GetAllWithArticlesAsync();
        Task<IDataResult<CategoryListDto>> GetAllByNonDeletedWithArticlesAsync();
        Task<IDataResult<CategoryListDto>> GetAllByNonDeletedAndActiveWithArticlesAsync();

    }
}
