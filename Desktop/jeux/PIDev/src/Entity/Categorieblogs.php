<?php

namespace App\Entity;

use App\Repository\CategorieblogsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategorieblogsRepository::class)]
class Categorieblogs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\NotBlank(message:'Ce champ est obligatoire !!')]
    #[Assert\Length(max: 255, maxMessage: 'La longueur maximale est de 255 caractères.')]
    private ?string $titrecategorie = null;


    #[ORM\Column(length: 2555, nullable: true)]
    #[Assert\NotBlank(message:'Ce champ est obligatoire !!')]

    private ?string $descriptioncategorie = null;

    #[ORM\OneToMany(mappedBy: 'categorieblogs', targetEntity: Blog::class)]
    private Collection $idblog;

    public function __construct()
    {
        $this->idblog = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitrecategorie(): ?string
    {
        return $this->titrecategorie;
    }

    public function setTitrecategorie(?string $titrecategorie): static
    {
        $this->titrecategorie = $titrecategorie;

        return $this;
    }

    public function getDescriptioncategorie(): ?string
    {
        return $this->descriptioncategorie;
    }

    public function setDescriptioncategorie(?string $descriptioncategorie): static
    {
        $this->descriptioncategorie = $descriptioncategorie;

        return $this;
    }

    /**
     * @return Collection<int, blog>
     */
    public function getIdblog(): Collection
    {
        return $this->idblog;
    }

    public function addIdblog(blog $idblog): static
    {
        if (!$this->idblog->contains($idblog)) {
            $this->idblog->add($idblog);
            $idblog->setCategorieblogs($this);
        }

        return $this;
    }

    public function removeIdblog(blog $idblog): static
    {
        if ($this->idblog->removeElement($idblog)) {
            // set the owning side to null (unless already changed)
            if ($idblog->getCategorieblogs() === $this) {
                $idblog->setCategorieblogs(null);
            }
        }

        return $this;
    }
}
