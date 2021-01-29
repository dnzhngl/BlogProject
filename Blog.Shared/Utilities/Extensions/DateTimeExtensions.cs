using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blog.Shared.Utilities.Extensions
{
    public static class DateTimeExtensions // Extent işlemleri ile ilgili sınıf ve metotlar static olmalı
    {
        public static string FullDateAndTimeStringWithUnderscore(this DateTime dateTime)
        {
            return $"{dateTime.Millisecond}_{dateTime.Second}_{dateTime.Minute}_{dateTime.Hour}_{dateTime.Day}_{dateTime.Month}_{dateTime.Year}";

            // JamesBond_601_5_38_12_3_10_2020.png
        }
    }
}
