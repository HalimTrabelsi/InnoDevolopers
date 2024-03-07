<?php

namespace App\Controller;

use App\Entity\Categorie;
use App\Form\CategorieType;
use App\Repository\CategorieRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CategorieController extends AbstractController
{
    #[Route('/categorie', name: 'app_categorie')]
    public function index(): Response
    {
        return $this->render('categorie/index.html.twig', [
            'controller_name' => 'CategorieController',
        ]);
    }
    #[Route('/addCategorie', name: 'addCategorie')]
    public function addCategorie(Request $req,ManagerRegistry $doctrine):Response
    { 
        $categorie=new Categorie();
        $form=$this->createForm(CategorieType::class,$categorie);
 
        $form->handleRequest($req);
        if ($form ->isSubmitted()&& $form->isValid()){
            $em=$doctrine->getManager();
            $em-> persist($categorie);
            $em->flush();
            return $this->redirectToRoute('app_afficherCategorie');
        }
        
        return $this->renderForm("categorie/AjouterCategorie/add.html.twig", ["myForm"=>$form]);

}
#[Route('/afficherCategorie', name: 'app_afficherCategorie')]
public function afficher(ManagerRegistry $doctrine): Response
{
    $repo=$doctrine->getRepository(Categorie::class);
    $categorie=$repo->findAll();
    return $this->render('categorie/ConsulterCategorie/list.html.twig', ['listCategorie'=>$categorie]);
}
#[Route('/editCategorie/{id}', name: 'app_editCategorie')]
public function edit(CategorieRepository $repository, $id, Request $request)
{
    $categorie = $repository->find($id);
    $form = $this->createForm(CategorieType::class, $categorie);
    $form->handleRequest($request);
    if ($form->isSubmitted() && $form->isValid()) {
        $em = $this->getDoctrine()->getManager();
        $em->flush(); 
        return $this->redirectToRoute("app_afficherCategorie");
    }

    return $this->render('categorie/ConsulterCategorie/edit.html.twig', [
        'myForm' => $form->createView(),
    ]);
}
#[Route('/deleteCategorie/{id}', name: 'app_deleteCategorie')]
    public function delete($id, CategorieRepository $repository)
    {
        $categorie = $repository->find($id);

        if (!$categorie) {
            throw $this->createNotFoundException('Categorie non trouvé');
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($categorie);
        $em->flush();

        
        return $this->redirectToRoute('app_afficherCategorie');
    }
      
}
