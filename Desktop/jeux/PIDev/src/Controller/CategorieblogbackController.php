<?php

namespace App\Controller;
use App\Form\CategorieblogType;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Categorieblogs;
use App\Repository\CategorieblogsRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Pagerfanta\Pagerfanta;

class CategorieblogbackController extends AbstractController
{
    #[Route('/categorieblogback', name: 'app_categorieblogback')]
    public function affichee(Request $request, ManagerRegistry $doctrine): Response
    {
        $em = $doctrine->getManager();
        $currentPage = $request->query->getInt('page', 1); 

        $itemsPerPage = 8; 
        $offset = ($currentPage - 1) * $itemsPerPage; 

        $commentRepository = $em->getRepository(Categorieblogs::class);

        
        $commentItems = $commentRepository->findBy([], null, $itemsPerPage, $offset);

        $totalItems = $commentRepository->count([]);

        $totalPages = ceil($totalItems / $itemsPerPage);

        return $this->render('categorieblogback/index.html.twig', [
            'commentitems' => $commentItems,
            'currentPage' => $currentPage,
            'totalPages' => $totalPages,
        ]);
    }

    #[Route('/categorieblogfront', name: 'app_categorieblogfront')]
    public function affichebcatFront(Request $request, ManagerRegistry $doctrine): Response
    {
        $em = $doctrine->getManager();
        $commentItems=$em->getRepository(Categorieblogs::class)->findAll();
return $this->render('blogfront/showauthordetaille.html.twig', [
    'ca'=> $commentItems,]);

    }


   
    #[Route('/deletecategorieclogs/{id}', name: 'app_deletecategorieclogs')]
    public function delete($id, CategorieblogsRepository $repository): RedirectResponse
    {
        $CatBlogs = $repository->find($id);
    
        if (!$CatBlogs) {
            $this->addFlash('error', 'La catégorie de blogs que vous essayez de supprimer n\'existe pas.');
            return $this->redirectToRoute('app_categorieblogback');
        }
    
        $em = $this->getDoctrine()->getManager();
        $em->remove($CatBlogs);
        $em->flush();
    
     $this->addFlash('success', 'La catégorie de blogs a été supprimée avec succès.');
        return $this->redirectToRoute('app_categorieblogback');       

    }
    
    
#[Route('/addcategorieblog', name: 'app_addcategorieblog')]
public function addcatblog(Request $req,ManagerRegistry $doctrine):Response
{ 
    $catblog=new Categorieblogs();
    $form=$this->createForm(CategorieblogType::class,$catblog);

    $form->handleRequest($req);
    if ($form ->isSubmitted()&& $form->isValid()){
        $em=$doctrine->getManager();
        $em-> persist($catblog);
        $em->flush();
        $this->addFlash('success', 'La catégorie de blogs a été Ajoutée avec succès.');

        return $this->redirectToRoute('app_categorieblogback');
    }

    return $this->renderForm("categorieblogback/add.html.twig", ['myForm'=>$form]);

}


#[Route('/editcategorieblog/{id}', name: 'app_editcategorieblog')]
public function edit(CategorieblogsRepository  $repository, $id, Request $request)
{
    $catblog = $repository->find($id);
    $form = $this->createForm(CategorieblogType::class, $catblog);
    $form->handleRequest($request);
    if ($form->isSubmitted() && $form->isValid()) {
        $em = $this->getDoctrine()->getManager();
        $em->flush(); 
        $this->addFlash('success', 'La catégorie de blogs a été Modifiée avec succès.');

        return $this->redirectToRoute("app_categorieblogback");
    }

    return $this->render('categorieblogback/add.html.twig', [
        'myForm' => $form->createView(),
    ]);
}


}
