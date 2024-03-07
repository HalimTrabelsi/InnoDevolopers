<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Entity\Blog;
use App\Entity\Commentaire;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\BlogrRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class BlogfrontController extends AbstractController
{
    
 
    
#[Route('/blogfront', name: 'app_blogfront')]
public function affiche(ManagerRegistry $doctrine): Response
{
    $blogRepository = $doctrine->getRepository(Blog::class);
    $blogs = $blogRepository->findAll();
    return $this->render('blogfront/index.html.twig', [
        'items' => $blogs,
    ]);
}


#[Route('/blogdetails/{id}', name: 'blogdetails')]

public function authordetails($id,ManagerRegistry $doctrine):Response{
    $blogRepository = $doctrine->getRepository(Blog::class);
    $blogs = $blogRepository->find($id);
    return $this->render('blogfront/showauthordetaille.html.twig', [
        'blog' => $blogs,
    ]);
}



 

}
