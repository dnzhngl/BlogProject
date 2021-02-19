using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Blog.Shared.Utilities.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Checks for Turkish letters in the given parameter and changes all of them to equivalent letters in English.
        /// </summary>
        /// <param name="text">Takes any kind of text in a type of string.</param>
        /// <returns>Returns the given text in English letters.</returns>
        public static string TurkishCharacterToEnglish(this string text)
        {
            char[] turkishChars = { 'ı', 'ğ', 'İ', 'Ğ', 'ç', 'Ç', 'ş', 'Ş', 'ö', 'Ö', 'ü', 'Ü' };
            char[] englishChars = { 'i', 'g', 'I', 'G', 'c', 'C', 's', 'S', 'o', 'O', 'u', 'U' };

            // Match chars
            for (int i = 0; i < turkishChars.Length; i++)
                text = text.Replace(turkishChars[i], englishChars[i]);

            return text;
        }


        /// <summary>
        /// Checks for the special characters and spaces in the given parameter and if found any changes with empty string.
        /// </summary>
        /// <param name="text">Takes string text.</param>
        /// <returns></returns>
        public static string CheckForSpecialCharacter(this string text)
        {
            //var regexItem = new Regex("^[a-zA-Z0-9]*$");
            text = Regex.Replace(text, @"[^0-9a-zA-Z]+", "");
            return text;
        }
    }
}
