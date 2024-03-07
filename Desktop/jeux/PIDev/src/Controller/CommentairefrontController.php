<?php

namespace App\Controller;
use App\Entity\Dislike;
use App\Entity\Like;
use App\Form\CommentaireType;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

use App\Entity\Admin;
use App\Entity\Blog;
use App\Entity\Commentaire;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Doctrine\ORM\EntityManagerInterface;
#[Route('/commentaire')]

class CommentairefrontController extends AbstractController
{

    #[Route('/commentairefront', name: 'app_commentairefront')]
    public function affichee(Request $request, ManagerRegistry $doctrine): Response
    {
        $commentRepository = $doctrine->getRepository(Commentaire::class);
        $comment = $commentRepository->findAll();
        return $this->render('commentairefront/index.html.twig', ['commentitems' => $comment,]);
    }

  
    #[Route('/blog/{id}', name: 'blog_show')]

    public function show(Request $request,$id,ManagerRegistry $doctrine)
    {
       
        $blogPost = $this->getDoctrine()->getRepository(Blog::class)->find($id);
        
        if (!$blogPost) {
            throw $this->createNotFoundException('L\'article de blog n\'existe pas');
        }
        
        $blogUrl = $this->generateUrl('blog_show', ['id' => $id], UrlGeneratorInterface::ABSOLUTE_URL);
    
        
        return $this->render('blogfront/share.html.twig', [
            'blogPost' => $blogPost,
            'blogUrl' => $blogUrl,
        ]);
    }

    #[Route('/jaime/{id}', name: 'app_commentaire_jaime', )]
    public function jaime(Request $request, int $id, EntityManagerInterface $entityManager): Response
    {        
        $commentaire = $entityManager->getRepository(Commentaire::class)->find($id);
        $admin = $entityManager->getRepository(Admin::class)->find(3); 

        if (!$commentaire) {
            throw $this->createNotFoundException('Commentaire non trouvé');
        }

        if ($commentaire->getIdadmin() === $admin && $commentaire->isJaime() === true) {
           
        }

        $commentaire->setJaime(true);
        $commentaire->setNejaimepas(false);
        $commentaire->setIdadmin($admin);
        $entityManager->flush();

        return $this->redirectToRoute('blogdetails', ['id' => $commentaire->getIdblog()->getId()]);
    }

    #[Route('/nejaimepas/{id}', name: 'app_commentaire_nejaimepas', )]
    public function neJaimePas(Request $request, int $id, EntityManagerInterface $entityManager): Response
    {        
        $commentaire = $entityManager->getRepository(Commentaire::class)->find($id);
        $admin = $entityManager->getRepository(Admin::class)->find(3);

        if (!$commentaire) {
            throw $this->createNotFoundException('Commentaire non trouvé');
        }

        if ($commentaire->getIdadmin() === $admin && $commentaire->isNejaimepas() === true) {
           
        }

        $commentaire->setNejaimepas(true);
        $commentaire->setJaime(false);
        $commentaire->setIdadmin($admin);
        $entityManager->flush();

        return $this->redirectToRoute('blogdetails', ['id' => $commentaire->getIdblog()->getId()]);
    }
    #[Route('/delete-comment/{id}', name: 'delete_comment')]
    public function deleteCommentaire(int $id): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $commentaire = $entityManager->getRepository(Commentaire::class)->find($id);
    
        if (!$commentaire) {
            throw $this->createNotFoundException('Commentaire non trouvé avec l\'identifiant '.$id);
        }
    
        $commentaire->getIdblog()->removeCommentaire($commentaire);
    
        $entityManager->remove($commentaire);
        $entityManager->flush();
    
        return $this->redirectToRoute('app_blogback');
    }


    
      
    #[Route('/delete-commentfront/{id}', name: 'delete_commentfront')]
    public function deleteCommentairefront(int $id, Request $request,Security $security): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $commentaire = $entityManager->getRepository(Commentaire::class)->find($id);

        if (!$commentaire) {
            throw $this->createNotFoundException('Commentaire non trouvé avec l\'identifiant '.$id);
        }

        $user = $security->getUser();
        $adminId = 3; 
        if ($user && $user->getUserIdentifier() !== $adminId) {
            throw new AccessDeniedException('Vous n\'avez pas le droit de supprimer ce commentaire.');
        }

        $commentaire->getIdblog()->removeCommentaire($commentaire);

        $entityManager->remove($commentaire);
        $entityManager->flush();

        $referer = $request->headers->get('referer');
        return new RedirectResponse($referer);;
    }


    
    
#[Route('/add-commentfront/{id}', name: 'add_commentfront')]
public function addCommentairefront($id, Request $request, Security $security): Response
{
    $badwords = ['shit', 'fuck', 'merde'];
    $blog = $this->getDoctrine()->getRepository(Blog::class)->find($id);

    if (!$blog) {
        throw $this->createNotFoundException('Blog non trouvé avec l\'identifiant '.$id);
    }

    $commentaire = new Commentaire();

    $form = $this->createForm(CommentaireType::class, $commentaire);

    $form->handleRequest($request);
    if ($form->isSubmitted() && $form->isValid()) {
        // Récupérer l'utilisateur connecté (avec l'ID 3)
        $adminId = 3; // ID de l'admin statiquement défini à 3
        $user = $this->getDoctrine()->getRepository(Admin::class)->find($adminId);
        if (!$user) {
            throw $this->createNotFoundException('Admin non trouvé avec l\'identifiant '.$adminId);
        }

        $commentContent = $commentaire->getContenue();
        foreach ($badwords as $badword) {
            if (stripos($commentContent, $badword) !== false) {
                $commentContent = str_replace($badword, '******', $commentContent);
            }
        }
        $commentaire->setContenue($commentContent);

        $commentaire->setIdadmin($user);
        $commentaire->setIdblog($blog);
        $commentaire->setNblike(0);
        $commentaire->setNbdislike(0);
        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($commentaire);
        $entityManager->flush();

        return $this->redirectToRoute('blogdetails', ['id' => $commentaire->getIdblog()->getId()]);
    }

    return $this->render('blogfront/add.html.twig', [
        'formadd' => $form->createView(),
    ]);
}


#[Route('/edit-commentfront/{id}', name: 'edit_commentfront')]
public function editCommentairefront($id, Request $request, Security $security): Response
{
    $badwords = ['shit', 'word2', 'word3'];

    $entityManager = $this->getDoctrine()->getManager();
    $user = $security->getUser();

    // Check user permissions (if required)
    // if (!$user || $user->getId() !== 3) {
    //     throw $this->createAccessDeniedException('Vous n\'avez pas les autorisations nécessaires pour effectuer cette action.');
    // }

    $commentaire = $entityManager->getRepository(Commentaire::class)->find($id);

    if (!$commentaire) {
        throw $this->createNotFoundException('Commentaire non trouvé avec l\'identifiant '.$id);
    }

    $form = $this->createForm(CommentaireType::class, $commentaire);
    $form->handleRequest($request);

    if ($form->isSubmitted() && $form->isValid()) {
$commentContent = $commentaire->getContenue();
foreach ($badwords as $badword) {
    $replacement = str_repeat('*', mb_strlen($badword)); // Create a string of asterisks with the same length as the bad word
    $commentContent = str_ireplace($badword, $replacement, $commentContent); // Case-insensitive replacement
}

        $commentaire->setContenue($commentContent);

        // Flush changes to the database
        $entityManager->flush();

        return $this->redirectToRoute('blogdetails', ['id' => $commentaire->getIdblog()->getId()]);
    }

    return $this->render('blogfront/add.html.twig', [
        'formadd' => $form->createView(),
    ]);
}


#[Route('/like/{id}', name: 'app_commentaire_like')]
public function like($id, EntityManagerInterface $entityManager): Response
{
    $commentaire = $entityManager->getRepository(Commentaire::class)->find($id);

    if (!$commentaire) {
        throw $this->createNotFoundException('Le commentaire n\'existe pas');
    }

    $likeee = $entityManager->getRepository(Like::class)->findOneBy(['commentaire' => $commentaire->getId(), 'userr' => 3]);
    $dislikeee = $entityManager->getRepository(Dislike::class)->findOneBy(['commentaire' => $commentaire->getId(), 'userr' => 3]);

    if ($likeee == null) {
        $commentaire->setNblike($commentaire->getNblike() + 1);
        $like = new Like();
        $like->setCommentaire($commentaire);
        $user = $entityManager->getRepository(Admin::class)->find(3);
        $like->setUserr($user);
        $entityManager->persist($like);

        if ($dislikeee != null) {
            $commentaire->setNbdislike($commentaire->getNbdislike() - 1);
            $entityManager->remove($dislikeee);
        }

        $entityManager->flush();
    } else {
        dump($likeee);
    }

    return $this->redirectToRoute('blogdetails', ['id' => $commentaire->getIdblog()->getId()]);
}

#[Route('/dislike/{id}', name: 'app_commentaire_dislike')]
public function dislike($id, EntityManagerInterface $entityManager): Response
{
    $commentaire = $entityManager->getRepository(Commentaire::class)->find($id);

    if (!$commentaire) {
        throw $this->createNotFoundException('Le commentaire n\'existe pas');
    }

    $likeee = $entityManager->getRepository(Like::class)->findOneBy(['commentaire' => $commentaire->getId(), 'userr' => 3]);
    $dislikeee = $entityManager->getRepository(Dislike::class)->findOneBy(['commentaire' => $commentaire->getId(), 'userr' => 3]);

    if ($dislikeee == null) {
        $commentaire->setNbdislike($commentaire->getNbdislike() + 1);
        $dislike = new Dislike();
        $dislike->setCommentaire($commentaire);
        $user = $entityManager->getRepository(Admin::class)->find(3);
        $dislike->setUserr($user);
        $entityManager->persist($dislike);

        if ($likeee != null) {
            $commentaire->setNblike($commentaire->getNblike() - 1);
            $entityManager->remove($likeee);
        }

        $entityManager->flush();
    } else {
        dump($dislikeee);
    }

    return $this->redirectToRoute('blogdetails', ['id' => $commentaire->getIdblog()->getId()]);
}


}
