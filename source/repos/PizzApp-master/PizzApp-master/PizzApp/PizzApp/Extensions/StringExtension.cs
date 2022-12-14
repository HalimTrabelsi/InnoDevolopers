using System;
using System.Collections.Generic;
using System.Text;

namespace PizzApp.Extensions
{
    public static class StringExtension
    {
        /// <summary>
        /// Get word with First letter to Upper
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string FirstLetterUpper(this string str)
        {
            if (string.IsNullOrEmpty(str))
                return str;

            string result = str.ToLower();
            result = result.Substring(0, 1).ToUpper() + result.Substring(1, result.Length - 1);

            return result;
        }

    }
}
