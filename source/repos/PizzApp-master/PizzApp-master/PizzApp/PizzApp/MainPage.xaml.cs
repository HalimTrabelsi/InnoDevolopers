using Newtonsoft.Json;
using PizzApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Xamarin.Forms;

namespace PizzApp
{
    public partial class MainPage : ContentPage
    {

        public MainPage()
        {
            InitializeComponent();


            #region MockupData
            /*
            listPizza.Add(new Pizza 
            { 
                Nom = "Végétarienne", 
                Prix = 10, 
                Ingredients = new string[] { "Tomate", "Poivron", "Aubergine", "Olive" } ,
                ImageUrl = "https://cac.img.pmdstatic.net/fit/http.3A.2F.2Fprd2-bone-image.2Es3-website-eu-west-1.2Eamazonaws.2Ecom.2Fcac.2F2018.2F09.2F25.2Ff0f33831-f80e-45b3-9032-593ada3ace5f.2Ejpeg/750x562/quality/80/crop-from/center/cr/wqkgUGF1bGluYSBKQUtPQklFQy9QUklTTUFQSVggLyBDdWlzaW5lIEFjdHVlbGxl/pizza-vegetarienne.jpeg"
            });
            listPizza.Add(new Pizza 
            { 
                Nom = "Cannibale", 
                Prix = 12, 
                Ingredients = new string[] { "Tomate", "Saucisse", "Merguez", "Viande hachée" },
                ImageUrl = "https://www.lesfoodies.com/_recipeimage/127142/pizza-cannibal-pour-les-gourmands.jpg"
            });
            listPizza.Add(new Pizza 
            { 
                Nom = "Indienne", 
                Prix = 9, 
                Ingredients = new string[] { "Crême fraiche", "Poulet", "Oignon", "Curry" },
                ImageUrl = "https://emporter.pizzapai.fr/media/catalog/product/cache/9/image/9df78eab33525d08d6e5fb8d27136e95/p/i/pizza-indienne.jpg"
            });
            listPizza.Add(new Pizza 
            { 
                Nom = "Texane", 
                Prix = 9, 
                Ingredients = new string[] { "Tomate", "Merguez", "Sauce barbecue", "Fromage" },
                ImageUrl = "https://lh3.googleusercontent.com/proxy/h1zR5iGCTsBN3VstvZf7tNjYctQoXUfD9RKLbt-1PF7tLC7ecDk80f90s0gDMZ19kWSAj1Hl2k2Eod24NnbumUlvY8K9"
            });
            listPizza.Add(new Pizza 
            { 
                Nom = "4 fromages", 
                Prix = 11, 
                Ingredients = new string[] { "Tomate", "Roblochon", "Roquefort", "Gruyère", "Olives", "Parmesan","Brie de Maux", "Mozarella" },
                ImageUrl = "https://static.thiriet.com/data/common_public/gallery_images/site/18756/18774/50361,pizza_pate_fine_4_fromages.jpg"
            });
            */
            #endregion                    

            ai.IsRunning = true;
            aiLayout.IsVisible = true;

            PizzasView.RefreshCommand = new Command((obj) =>
            {
                DownloadData(pizzas =>
                {
                    PizzasView.ItemsSource = pizzas;
                    PizzasView.IsRefreshing = false;
                });

            });

            DownloadData(pizzas =>
            {
                PizzasView.ItemsSource = pizzas;
                aiLayout.IsVisible = false;
                ai.IsRunning = false;
            });

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="action"></param>
        private void DownloadData(Action<List<Pizza>> action)
        {
            // URI du fichier JSON sur Google Drive
            const string uri = "https://drive.google.com/uc?export=download&id=1Tj9_BVjKvveyELjoVa8KJT96v5-qzUCx";

            // Définition d'un WebClient
            using (var webClient = new WebClient())
            {
                // Méthode de retour lorsque le téléchargement du fichier est terminé
                webClient.DownloadStringCompleted += (sender, e) =>
                {                
                    try
                    {
                        // Désérialisation du JSON
                        List<Pizza> listPizza = JsonConvert.DeserializeObject<List<Pizza>>(e.Result);
                        listPizza = listPizza.OrderBy(x => x.Prix).ToList();

                        // On repasse sur le thread de la main page pour afficher les données
                        Device.BeginInvokeOnMainThread(() =>
                        {
                            action.Invoke(listPizza);
                        });

                    }
                    catch (Exception ex)
                    {
                        // On repasse sur le thread de la main page pour afficher l'erreur
                        Device.BeginInvokeOnMainThread(() =>
                        {
                            DisplayAlert("Erreur", "Une erreur s'est produite : " + ex.Message, "Ok");
                            action.Invoke(null);
                        });

                    }

                };

                // téléchargement du fichier Json en asynchrone
                webClient.DownloadStringAsync(new Uri(uri));
            }
        }
    }
}

