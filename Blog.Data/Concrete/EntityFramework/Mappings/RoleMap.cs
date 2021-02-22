using Blog.Entities.Concrete;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Data.Concrete.EntityFramework.Mappings
{
    public class RoleMap : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            #region Before ASP.NET CORE Identity
            //builder.HasKey(r => r.Id);
            //builder.Property(r => r.Id).ValueGeneratedOnAdd();
            //builder.Property(r => r.Name).IsRequired();
            //builder.Property(r => r.Name).HasMaxLength(30);
            //builder.Property(r => r.Description).IsRequired();
            //builder.Property(r => r.Description).HasMaxLength(250);

            //builder.Property(r => r.CreatedByName).IsRequired();
            //builder.Property(r => r.CreatedByName).HasMaxLength(50);
            //builder.Property(r => r.ModifiedByName).IsRequired();
            //builder.Property(r => r.ModifiedByName).HasMaxLength(50);
            //builder.Property(r => r.CreatedDate).IsRequired();
            //builder.Property(r => r.ModifiedDate).IsRequired();
            //builder.Property(r => r.IsActive).IsRequired();
            //builder.Property(r => r.IsDeleted).IsRequired();
            //builder.Property(r => r.Note).HasMaxLength(500);

            //builder.ToTable("Roles");

            //builder.HasData(new Role
            //{
            //    Id = 1,
            //    Name = "Admin",
            //    Description = "Admin rolü tüm haklara sahiptir.",
            //    IsActive = true,
            //    IsDeleted = false,
            //    CreatedByName = "InitialCreate",
            //    CreatedDate = DateTime.Now,
            //    ModifiedByName = "InitialCreate",
            //    ModifiedDate = DateTime.Now,
            //    Note = "Admin rolüdür."
            //});
            #endregion

            // Primary key
            builder.HasKey(r => r.Id);

            // Index for "normalized" role name to allow efficient lookups
            builder.HasIndex(r => r.NormalizedName).HasDatabaseName("RoleNameIndex").IsUnique();

            // Maps to the AspNetRoles table
            builder.ToTable("Roles");

            // A concurrency token for use with the optimistic concurrency checking
            builder.Property(r => r.ConcurrencyStamp).IsConcurrencyToken();

            // Limit the size of columns to use efficient database types
            builder.Property(u => u.Name).HasMaxLength(100);
            builder.Property(u => u.NormalizedName).HasMaxLength(100);

            // The relationships between Role and other entity types
            // Note that these relationships are configured with no navigation properties

            // Each Role can have many entries in the UserRole join table
            builder.HasMany<UserRole>().WithOne().HasForeignKey(ur => ur.RoleId).IsRequired();

            // Each Role can have many associated RoleClaims
            builder.HasMany<RoleClaim>().WithOne().HasForeignKey(rc => rc.RoleId).IsRequired();

            #region Before updates in roles
            //builder.HasData(
            //    new Role
            //    {
            //        Id = 1,
            //        Name = "Admin",
            //        NormalizedName = "ADMIN",
            //        ConcurrencyStamp = Guid.NewGuid().ToString()
            //    },
            //    new Role
            //    {
            //        Id = 2,
            //        Name = "Editor",
            //        NormalizedName = "EDITOR",
            //        ConcurrencyStamp = Guid.NewGuid().ToString()
            //    });
            #endregion

            builder.HasData(
            new Role
            {
                Id = 1,
                Name = "Category.Create",
                NormalizedName = "CATEGORY.CREATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 2,
                Name = "Category.Read",
                NormalizedName = "CATEGORY.READ",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 3,
                Name = "Category.Update",
                NormalizedName = "CATEGORY.UPDATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 4,
                Name = "Category.Delete",
                NormalizedName = "CATEGORY.DELETE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 5,
                Name = "Article.Create",
                NormalizedName = "ARTICLE.CREATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 6,
                Name = "Article.Read",
                NormalizedName = "ARTICLE.READ",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 7,
                Name = "Article.Update",
                NormalizedName = "ARTICLE.UPDATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 8,
                Name = "Article.Delete",
                NormalizedName = "ARTICLE.DELETE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 9,
                Name = "User.Create",
                NormalizedName = "USER.CREATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 10,
                Name = "User.Read",
                NormalizedName = "USER.READ",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 11,
                Name = "User.Update",
                NormalizedName = "USER.UPDATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 12,
                Name = "User.Delete",
                NormalizedName = "USER.DELETE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 13,
                Name = "Role.Create",
                NormalizedName = "ROLE.CREATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 14,
                Name = "Role.Read",
                NormalizedName = "ROLE.READ",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 15,
                Name = "Role.Update",
                NormalizedName = "ROLE.UPDATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 16,
                Name = "Role.Delete",
                NormalizedName = "ROLE.DELETE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 17,
                Name = "Comment.Create",
                NormalizedName = "COMMENT.CREATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 18,
                Name = "Comment.Read",
                NormalizedName = "COMMENT.READ",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 19,
                Name = "Comment.Update",
                NormalizedName = "COMMENT.UPDATE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 20,
                Name = "Comment.Delete",
                NormalizedName = "COMMENT.DELETE",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 21,
                Name = "AdminArea.Home.Read",
                NormalizedName = "ADMINAREA.HOME.READ",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            },
            new Role
            {
                Id = 22,
                Name = "SuperAdmin",
                NormalizedName = "SUPERADMIN",
                ConcurrencyStamp = Guid.NewGuid().ToString()
            });
        }
    }
}
