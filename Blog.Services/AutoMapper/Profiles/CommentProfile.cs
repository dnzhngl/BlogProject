using AutoMapper;
using Blog.Entities.Concrete;
using Blog.Entities.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Services.AutoMapper.Profiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentAddDto, Comment>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(x => DateTime.Now))
                .ForMember(dest => dest.ModifiedDate, opt => opt.MapFrom(x => DateTime.Now))
                .ForMember(dest => dest.ModifiedByName, opt => opt.MapFrom(x => x.CreatedByName))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(x => false));

            CreateMap<CommentUpdateDto, Comment>()
                .ForMember(dest => dest.ModifiedDate, opt => opt.MapFrom(x => DateTime.Now));

            CreateMap<Comment, CommentUpdateDto>();

        }
    }
}
