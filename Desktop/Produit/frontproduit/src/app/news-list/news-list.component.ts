import { Component, OnInit } from '@angular/core';
import { Article } from '../models/News';
import { ProduitService } from '../services/produit.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  articles: Article[] = [];  // Déclare les articles comme un tableau d'Article
  category = 'technology'; // Catégorie par défaut

  constructor(private newsApiService: ProduitService) { }

  ngOnInit(): void {
    this.getNews();
  }

  // Fonction pour récupérer les news
  getNews(): void {
    this.newsApiService.getNewsByCategory(this.category).subscribe(
      (data) => {
        this.articles = data; // On met à jour la liste des articles
      },
      (error) => {
        console.error('Erreur de récupération des articles:', error);
      }
    );
  }

  // Changer de catégorie et récupérer de nouvelles news
  changeCategory(newCategory: string): void {
    this.category = newCategory;
    this.getNews();
  }
}
