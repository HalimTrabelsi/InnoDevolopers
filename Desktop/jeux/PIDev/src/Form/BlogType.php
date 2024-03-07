<?php

namespace App\Form;

use App\Entity\Blog;
use App\Entity\Categorieblogs;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType;

class BlogType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titre')
            ->add('description')
            ->add('imageFile', VichImageType::class, [
                'label' => 'Image (JPG or PNG)',
            ])
            
            ->add('lieu')
            ->add('rate')
            ->add('categorieblogs', EntityType::class, [
                'class' => Categorieblogs::class,
                'choice_label' => 'titrecategorie', // Assuming 'titrecategorie' is the property you want to display in the dropdown
                'placeholder' => 'Choose a category', // Optional placeholder
                'attr' => ['class' => 'form-control'], // Optional CSS class for styling
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Blog::class,
        ]);
    }
}
