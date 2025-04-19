import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategorieComponent } from './categorie/categorie.component';
import { compteGuard } from './compte.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontproduitComponent } from './frontproduit/frontproduit.component';
import { LoginComponent } from './login/login.component';
import { NewsListComponent } from './news-list/news-list.component';
import { ProduitComponent } from './produit/produit.component';
import { PublicGuard } from './public.guard';
import { RoleGuard } from './Role.guard';

const routes: Routes = [

  { path: '', redirectTo: '/categories', pathMatch: 'full' },  // Rediriger vers /categories par défaut
  { path: 'categories', component: CategorieComponent, canActivate: [RoleGuard], data: { role: 'admin' }},       // Route pour la liste des catégories
  { path: 'produits', component: ProduitComponent ,canActivate: [RoleGuard], data: { role: 'admin' } },           // Route pour la liste des produits
  { path: 'produits/:id', component: ProduitComponent },  
  { path: 'pf', component: FrontproduitComponent  , canActivate: [PublicGuard]},
  {path:'dashboard',component:DashboardComponent, canActivate: [RoleGuard], data: { role: 'client' } },
  {path:'news',component:NewsListComponent, },
    // Route pour éditer un produit
  {path:'login',component:LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
