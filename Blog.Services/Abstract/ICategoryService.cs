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

        /// <summary>
        /// Adds a new Category into the database with the given data in parameters.
        /// </summary>
        /// <param name="categoryAddDto"> The information of the Category to be added must be entered in CategoryAddDto type. </param>
        /// <param name="createdByName"> The username of the creator must be entered in a type of string. </param>
        /// <returns> Returns type of DataResult as a result of an asynchronous adding operation. </returns>
        Task<IDataResult<CategoryDto>> AddAsync(CategoryAddDto categoryAddDto, string createdByName);
        Task<IDataResult<CategoryDto>> UpdateAsync(CategoryUpdateDto categoryUpdateDto, string modifiedByName);
        Task<IDataResult<CategoryDto>> DeleteAsync(int categoryId, string modifiedByName);   //isDeleted değiştirilir
        Task<IResult> HardDeleteAsync(int categoryId);   //veritabanından silmek için

        /// <summary>
        /// Gets the category, if any, with the specified id. If it can not find any data, CategoryUpdateDto returns with the ResulStatus.Error and NotFound message.
        /// </summary>
        /// <param name="categoryId">CategoryId must be bigger than 0 and type of integer.</param>
        /// <returns>Returns type of DataResult as a result of an asynchronous operation.</returns>
        Task<IDataResult<CategoryUpdateDto>> GetCategoryUpdateDtoAsync(int categoryId); //CategoryUpdate için CategoryUpdateDto türünde return yapacak
        Task<IDataResult<int>> CountAsync();
        Task<IDataResult<int>> CountByNonDeletedAsync();

        Task<IDataResult<CategoryListDto>> GetAllWithArticlesAsync();
        Task<IDataResult<CategoryListDto>> GetAllByNonDeletedWithArticlesAsync();
        Task<IDataResult<CategoryListDto>> GetAllByNonDeletedAndActiveWithArticlesAsync();

    }
}
