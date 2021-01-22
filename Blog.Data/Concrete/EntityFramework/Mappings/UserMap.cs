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
    public class UserMap : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            #region Before ASP.NET CORE Identity
            //builder.HasKey(u => u.Id);
            //builder.Property(u => u.Id).ValueGeneratedOnAdd();
            //builder.Property(u => u.Firstname).IsRequired();
            //builder.Property(u => u.Firstname).HasMaxLength(30);
            //builder.Property(u => u.Lastname).IsRequired();
            //builder.Property(u => u.Lastname).HasMaxLength(30);
            //builder.Property(u => u.Email).IsRequired();
            //builder.Property(u => u.Email).HasMaxLength(50);
            //builder.HasIndex(u => u.Email).IsUnique();
            //builder.Property(u => u.Username).IsRequired();
            //builder.Property(u => u.Username).HasMaxLength(20);
            //builder.HasIndex(u => u.Username).IsUnique();
            //builder.Property(u => u.PasswordHash).IsRequired();
            //builder.Property(u => u.PasswordHash).HasColumnType("VARBINARY(500)");
            //builder.Property(u => u.Description).HasMaxLength(500);


            //builder.Property(u => u.CreatedByName).IsRequired();
            //builder.Property(u => u.CreatedByName).HasMaxLength(50);
            //builder.Property(u => u.ModifiedByName).IsRequired();
            //builder.Property(u => u.ModifiedByName).HasMaxLength(50);
            //builder.Property(u => u.CreatedDate).IsRequired();
            //builder.Property(u => u.ModifiedDate).IsRequired();
            //builder.Property(u => u.IsActive).IsRequired();
            //builder.Property(u => u.IsDeleted).IsRequired();
            //builder.Property(u => u.Note).HasMaxLength(500);

            //builder.HasOne<Role>(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId);

            //builder.ToTable("Users");


            //builder.HasData(new User
            //{
            //    Id = 1,
            //    RoleId = 1,
            //    Firstname = "Deniz",
            //    Lastname = "Cakmak",
            //    Email = "rdenizhanoglu@hotmail.com",
            //    Username = "dnzhngl",
            //    PasswordHash = Encoding.ASCII.GetBytes("0192023a7bbd73250516f069df18b500"),
            //    Description = "İlk admin kullanıcı",
            //    Picture = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSX4wVGjMQ37PaO4PdUVEAliSLi8-c2gJ1zvQ&usqp=CAU",
            //    IsActive = true,
            //    IsDeleted = false,
            //    CreatedByName = "InitialCreate",
            //    CreatedDate = DateTime.Now,
            //    ModifiedByName = "InitialCreate",
            //    ModifiedDate = DateTime.Now,
            //    Note = "Admin Kullanıcısı",
            //});
            #endregion

            // Primary key
            builder.HasKey(u => u.Id);

            // Indexes for "normalized" username and email, to allow efficient lookups
            builder.HasIndex(u => u.NormalizedUserName).HasDatabaseName("UserNameIndex").IsUnique();
            builder.HasIndex(u => u.NormalizedEmail).HasDatabaseName("EmailIndex");

            // Maps to the AspNetUsers table
            builder.ToTable("AspNetUsers");

            // A concurrency token for use with the optimistic concurrency checking
            builder.Property(u => u.ConcurrencyStamp).IsConcurrencyToken();

            // Limit the size of columns to use efficient database types
            builder.Property(u => u.UserName).HasMaxLength(50);
            builder.Property(u => u.NormalizedUserName).HasMaxLength(50);
            builder.Property(u => u.Email).HasMaxLength(100);
            builder.Property(u => u.NormalizedEmail).HasMaxLength(100);

            builder.Property(u => u.Picture).IsRequired();
            builder.Property(u => u.Picture).HasMaxLength(250);

            // The relationships between User and other entity types
            // Note that these relationships are configured with no navigation properties

            // Each User can have many UserClaims
            builder.HasMany<UserClaim>().WithOne().HasForeignKey(uc => uc.UserId).IsRequired();

            // Each User can have many UserLogins
            builder.HasMany<UserLogin>().WithOne().HasForeignKey(ul => ul.UserId).IsRequired();

            // Each User can have many UserTokens
            builder.HasMany<UserToken>().WithOne().HasForeignKey(ut => ut.UserId).IsRequired();

            // Each User can have many entries in the UserRole join table
            builder.HasMany<UserRole>().WithOne().HasForeignKey(ur => ur.UserId).IsRequired();



        }
    }
}
