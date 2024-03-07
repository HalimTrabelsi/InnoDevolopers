<?php

namespace App\Controller;

use App\Entity\Medicament;
use App\Form\MedicamentType;
use App\Repository\MedicamentRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class MedicamentController extends AbstractController
{
    #[Route('/medicament', name: 'app_medicament')]
    public function index(): Response
    {
        return $this->render('medicament/index.html.twig', [
            'controller_name' => 'MedicamentController',
        ]);
    }
    #[Route('/addMedicament', name: 'app_addMedicament')]
    public function addMedicament(Request $req,ManagerRegistry $doctrine):Response
    { 
        $medicament=new Medicament();
        $form=$this->createForm(MedicamentType::class,$medicament);
 
        $form->handleRequest($req);
        if ($form ->isSubmitted()&& $form->isValid()){
            $em=$doctrine->getManager();
            $em-> persist($medicament);
            $em->flush();
            return $this->redirectToRoute('app_afficherMedicament');
        }
        
        return $this->renderForm("medicament/AjouterMedicament/add1.html.twig", ["myForm"=>$form]);

}
#[Route('/afficherMedicament', name: 'app_afficherMedicament')]
public function afficher(ManagerRegistry $doctrine): Response
{
    $repo=$doctrine->getRepository(Medicament::class);
    $medicament=$repo->findAll();
    return $this->render('medicament/ConsulterMedicament/list2.html.twig', ['list'=>$medicament]);
}

#[Route('/editMedicament/{id}', name: 'app_editMedicament')]
public function edit(MedicamentRepository $repository, $id, Request $request)
{
    $medicament = $repository->find($id);
    $form = $this->createForm(MedicamentType::class, $medicament);
    $form->handleRequest($request);
    if ($form->isSubmitted() && $form->isValid()) {
        $em = $this->getDoctrine()->getManager();
        $em->flush(); // Correction : Utilisez la méthode flush() sur l'EntityManager pour enregistrer les modifications en base de données.
        return $this->redirectToRoute("app_afficherMedicament");
    }

    return $this->render('medicament/ConsulterMedicament/edit.html.twig', [
        'myForm' => $form->createView(),
    ]);
}
#[Route('/deleteMedicament/{id}', name: 'app_deleteMedicament')]
public function delete($id, MedicamentRepository $repository)
{
    $medicament = $repository->find($id);
    $em = $this->getDoctrine()->getManager();
    $em->remove($medicament);
    $em->flush();
    return $this->redirectToRoute('app_afficherMedicament');
}


}
