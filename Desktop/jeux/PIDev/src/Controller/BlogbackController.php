<?php

namespace App\Controller;
use App\Entity\Blog;
use App\Entity\Commentaire;
use App\Form\BlogType;
use App\Repository\BlogRepository;
use TCPDF;

use App\Repository\CommentaireRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
#[Route('/blogback')]

class BlogbackController extends AbstractController
{
    #[Route('/affiche', name: 'app_blogback')]
    public function affiche(ManagerRegistry $doctrine): Response
{
    $blogRepository = $doctrine->getRepository(Blog::class);
    $blogs = $blogRepository->findAll();
    return $this->render('blogback/index.html.twig', [
        'blogback' => $blogs,
    ]);
}

#[Route('/generate-pdf', name: 'generate_pdf')]
public function generatePdf(): Response
{
    $blogs = $this->getDoctrine()->getRepository(Blog::class)->findAll();

    $pdf = new TCPDF();
    $pdf->setPrintHeader(true); 
    $pdf->setPrintFooter(false);
    $pdf->AddPage();

    $data = array();
    foreach ($blogs as $blog) {
        $categoryId = '';
        if ($blog->getCategorieBlogs() !== null) {
            $categoryId = $blog->getCategorieBlogs()->getTitrecategorie();
        }

        $publicationDate = '';
        if ($blog->getDatePub() !== null) {
            $publicationDate = $blog->getDatePub()->format('Y-m-d');
        }

        $data[] = array(
            $blog->getId(),
            $blog->getTitre(),
            $blog->getLieu(),
            $blog->getRate(),
            $categoryId, // Supposons que getCategorieBlogs() renvoie l'entité de catégorie, et que 'getNom()' retourne le nom de la catégorie
            $publicationDate // Formatage de la date de publication selon vos besoins
        );
    }

    // Définir les en-têtes de colonne
    $headers = array('ID', 'Titre', 'Lieu', 'Rate', 'Catégorie', 'Date de Publication');

    // Définir le style du tableau
    $pdf->SetFillColor(255, 255, 255); // Couleur de fond
    $pdf->SetTextColor(0); // Couleur du texte
    $pdf->SetDrawColor(128, 128, 128); // Couleur de la bordure
    $pdf->SetLineWidth(0.3); // Épaisseur de la bordure
    $pdf->SetFont('', 'B'); // Police en gras

    // Ajouter le tableau au PDF
    $html = $this->getTableHTML($headers, $data);
    $pdf->WriteHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, 'C', true);

    // Générer le PDF et le renvoyer en réponse
    $pdf->Output('blog_list.pdf', 'D');

    return new Response('PDF generated successfully');
}

// Fonction pour générer le HTML du tableau à partir des données
private function getTableHTML($headers, $data)
{
    $html = '<table border="1">';
    // En-têtes de colonne
    $html .= '<tr>';
    foreach ($headers as $header) {
        $html .= '<th>' . $header . '</th>';
    }
    $html .= '</tr>';
    // Données
    foreach ($data as $row) {
        $html .= '<tr>';
        foreach ($row as $cell) {
            $html .= '<td>' . $cell . '</td>';
        }
        $html .= '</tr>';
    }
    $html .= '</table>';
    return $html;
}
#[Route('/delete/{id}', name: 'app_deleteblogs')]
public function delete($id, BlogRepository $repository): RedirectResponse
{
    $CatBlogs = $repository->find($id);

    if (!$CatBlogs) {
        $this->addFlash('error', ' Blogs que vous essayez de supprimer n\'existe pas.');
        return $this->redirectToRoute('app_blogback');
    }

    $em = $this->getDoctrine()->getManager();
    $em->remove($CatBlogs);
    $em->flush();

 $this->addFlash('success', 'Blog blogs a été supprimée avec succès.');
    return $this->redirectToRoute('app_blogback');       

}

#[Route('/addblog', name: 'app_addblog')]
    public function addcatblog(Request $request, ManagerRegistry $doctrine): Response 
    { 
        $catblog=new Blog();
        $form=$this->createForm(BlogType::class,$catblog);

        $form->handleRequest($request);
        if ($form ->isSubmitted()&& $form->isValid()){
           // $catblog->setImageFile($form['imageFile']->getData()); // Set the imageFile property
            $em=$doctrine->getManager();
            $em->persist($catblog);
            $em->flush();
            $this->addFlash('success', 'Blog  a été Ajoutée avec succès.');

            return $this->redirectToRoute('app_blogback');
        }

        return $this->renderForm("blogback/add.html.twig", ['form'=>$form]);
    }
    #[Route('/editblog/{id}', name: 'app_editblog')]
    public function edit(BlogRepository $repository, $id, Request $request)
    {
        $catblog = $repository->find($id);
        $form = $this->createForm(BlogType::class, $catblog);
        $form->handleRequest($request);
    
        if ($form->isSubmitted() && $form->isValid()) {
            $newImage = $form['imageFile']->getData();
            
            if ($newImage) {
                $catblog->setImageFile($newImage); // Set the new image file
            }
    
            $em = $this->getDoctrine()->getManager();
            $em->flush(); 
            $this->addFlash('success', 'Le blog a été modifié avec succès.');
    
            return $this->redirectToRoute('app_blogback');
        }
    
        return $this->render('blogback/add.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    #[Route('/commentaireback', name: 'app_commentaireback')]
    public function affichee(Request $request, ManagerRegistry $doctrine): Response
    {
        $commentRepository = $doctrine->getRepository(Commentaire::class);
        $comment = $commentRepository->findAll();
        return $this->render('blogback/index.html.twig', ['commentitems' => $comment,]);
    }
    #[Route('/blogdetailsback/{id}', name: 'blogdetailsback')]

    public function authordetails($id,ManagerRegistry $doctrine):Response{
        $blogRepository = $doctrine->getRepository(Blog::class);
        $blogs = $blogRepository->find($id);
        return $this->render('blogback/index.html.twig', [
            'blog' => $blogs,
        ]);
    }
    #[Route('/blog', name: 'blog')]

    public function statistiquesCommentaires(): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        
        // Récupérer les commentaires groupés par blog
        $commentairesParBlog = $entityManager->getRepository(Commentaire::class)->getCommentairesParBlog();

        // Convertir les résultats en un format adapté pour Chart.js
        $labels = [];
        $data = [];
        foreach ($commentairesParBlog as $commentaire) {
            $labels[] = $commentaire['titre']; // Supposons que 'titre' est le champ contenant le nom du blog
            $data[] = $commentaire['nombreCommentaires'];
        }

        return $this->render('blogback/stat.html.twig', [
            'labels' => json_encode($labels),
            'data' => json_encode($data),
        ]);
    }

    #[Route('/stats/rate-par-blog', name: 'rate_par_blog')]
    public function rateParBlog(BlogRepository $blogRepository): JsonResponse
    {
        // Récupérer les données sur le taux par blog depuis la base de données
        $blogs = $blogRepository->findAll();
        $ratesPerBlog = [];

        foreach ($blogs as $blog) {
            $ratesPerBlog[$blog->getTitre()] = $blog->getRate();
        }

        // Convertir les données en format JSON pour être utilisées avec Chart.js
        $data = [
            'labels' => array_keys($ratesPerBlog),
            'data' => array_values($ratesPerBlog),
        ];

        return $this->json($data);
    }

}
