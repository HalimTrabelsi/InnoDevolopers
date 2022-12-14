using System;
using System.Collections.Generic;
using System.Text;
using PizzApp.Extensions;

namespace PizzApp.Models
{
    class Pizza
    {

        public string Nom { get; set; }

        public int Prix { get; set; }

        public string[] Ingredients { get; set; }

        public string PrixEuro { get { return Prix + " €"; } }

        public string IngredientsStr { get { return string.Join(", ", Ingredients); } }

        public string Titre { get { return Nom.FirstLetterUpper(); } }

        public string ImageUrl { get; set; }
    }
}
