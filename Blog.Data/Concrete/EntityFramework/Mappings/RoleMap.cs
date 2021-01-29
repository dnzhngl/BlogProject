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
            builder.ToTable("AspNetRoles");

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

            builder.HasData(
                new Role
                {
                    Id = 1,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                },
                new Role
                {
                    Id = 2,
                    Name = "Editor",
                    NormalizedName = "EDITOR",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                });
        }
    }
}
