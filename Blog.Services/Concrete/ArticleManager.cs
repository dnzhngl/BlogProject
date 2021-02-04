using AutoMapper;
using Blog.Data.Abstract;
using Blog.Entities.Concrete;
using Blog.Entities.Dtos;
using Blog.Services.Abstract;
using Blog.Services.Utilities;
using Blog.Shared.Utilities.Results.Abstract;
using Blog.Shared.Utilities.Results.ComplexTypes;
using Blog.Shared.Utilities.Results.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Services.Concrete
{
    public class ArticleManager : IArticleService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public ArticleManager(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<IDataResult<ArticleDto>> Add(ArticleAddDto articleAddDto, string createdByName)
        {
            var article = _mapper.Map<Article>(articleAddDto);
            article.CreatedByName = createdByName;
            article.ModifiedByName = createdByName;
            article.UserId = 1;
            var addedArticle = await _uow.Articles.AddAsync(article);
            await _uow.SaveAsync();

            return new DataResult<ArticleDto>(ResultStatus.Success, Messages.Article.Add(addedArticle.Title), new ArticleDto
            {
                Article = addedArticle,
                ResultStatus = ResultStatus.Success,
                Message = Messages.Article.Add(addedArticle.Title)
            });
        }

        public async Task<IResult> Delete(int articleId, string modifiedByName)
        {
            var result = await _uow.Articles.AnyAsync(a => a.Id == articleId);
            if (result)
            {
                var article = await _uow.Articles.GetAsync(a => a.Id == articleId);
                article.IsDeleted = true;
                article.ModifiedByName = modifiedByName;
                article.ModifiedDate = DateTime.Now;
                await _uow.Articles.UpdateAsync(article);
                await _uow.SaveAsync();

                return new Result(ResultStatus.Success, Messages.Article.Delete(article.Title));
            }
            return new Result(ResultStatus.Error, Messages.Article.NotFound(isPlural: false));
        }

        public async Task<IDataResult<ArticleDto>> Get(int articleId)
        {
            var article = await _uow.Articles.GetAsync(a => a.Id == articleId, a => a.Category, a => a.User);
            if (article != null)
            {
                return new DataResult<ArticleDto>(ResultStatus.Success, new ArticleDto
                {
                    Article = article,
                    ResultStatus = ResultStatus.Success
                });
            }
            return new DataResult<ArticleDto>(ResultStatus.Error, Messages.Article.NotFound(isPlural: false), new ArticleDto
            {
                Article = null,
                ResultStatus = ResultStatus.Error,
                Message = Messages.Article.NotFound(isPlural: false)
            });
        }

        public async Task<IDataResult<ArticleListDto>> GetAll()
        {
            var articles = await _uow.Articles.GetAllAsync(null, a => a.User, a => a.Category);
            if (articles.Count > -1)
            {
                return new DataResult<ArticleListDto>(ResultStatus.Success, new ArticleListDto
                {
                    Articles = articles,
                    ResultStatus = ResultStatus.Success
                });
            }
            return new DataResult<ArticleListDto>(ResultStatus.Error, Messages.Article.NotFound(isPlural: true), null);
        }

        public async Task<IDataResult<ArticleListDto>> GetAllByCategory(int categoryId)
        {
            var result = await _uow.Categories.AnyAsync(c => c.Id == categoryId);
            if (result)
            {
                var articles = await _uow.Articles.GetAllAsync(a => a.CategoryId == categoryId && !a.IsDeleted && a.IsActive, a => a.User, a => a.Category);
                if (articles.Count > -1)
                {
                    return new DataResult<ArticleListDto>(ResultStatus.Success, new ArticleListDto
                    {
                        Articles = articles,
                        ResultStatus = ResultStatus.Success
                    });
                }
                return new DataResult<ArticleListDto>(ResultStatus.Error, Messages.Article.NotFound(isPlural: true), null);
            }
            return new DataResult<ArticleListDto>(ResultStatus.Error, Messages.Category.NotFound(isPlural: false), null);
        }

        public async Task<IDataResult<ArticleListDto>> GetAllByNonDeleted()
        {
            var articles = await _uow.Articles.GetAllAsync(a => !a.IsDeleted, a => a.User, a => a.Category);
            if (articles.Count > -1)
            {
                return new DataResult<ArticleListDto>(ResultStatus.Success, new ArticleListDto
                {
                    Articles = articles,
                    ResultStatus = ResultStatus.Success
                });
            }
            return new DataResult<ArticleListDto>(ResultStatus.Error, Messages.Article.NotFound(isPlural: true), null);
        }

        public async Task<IDataResult<ArticleListDto>> GetAllByNonDeletedAndActive()
        {
            var articles = await _uow.Articles.GetAllAsync(a => !a.IsDeleted && a.IsActive, a => a.User, a => a.Category);
            if (articles.Count > -1)
            {
                return new DataResult<ArticleListDto>(ResultStatus.Success, new ArticleListDto
                {
                    Articles = articles,
                    ResultStatus = ResultStatus.Success
                });
            }
            return new DataResult<ArticleListDto>(ResultStatus.Error, Messages.Article.NotFound(isPlural: true), null);
        }

        public async Task<IResult> HardDelete(int articleId)
        {
            var result = await _uow.Articles.AnyAsync(a => a.Id == articleId);
            if (result)
            {
                var article = await _uow.Articles.GetAsync(a => a.Id == articleId);
                await _uow.Articles.DeleteAsync(article);
                await _uow.SaveAsync();

                return new Result(ResultStatus.Success, Messages.Article.HardDelete(article.Title));
            }
            return new Result(ResultStatus.Error, Messages.Article.NotFound(isPlural: false));
        }

        public async Task<IDataResult<ArticleDto>> Update(ArticleUpdateDto articleUpdateDto, string modifiedByName)
        {
            var article = _mapper.Map<Article>(articleUpdateDto);
            article.ModifiedByName = modifiedByName;
            var updatedArticle = await _uow.Articles.UpdateAsync(article);
            await _uow.SaveAsync();

            return new DataResult<ArticleDto>(ResultStatus.Success, Messages.Article.Update(updatedArticle.Title), new ArticleDto
            {
                Article = updatedArticle,
                ResultStatus = ResultStatus.Success,
                Message = Messages.Article.Update(updatedArticle.Title)
            });
        }
    }
}
