<?php

namespace App\Entity;

use App\Repository\BlogRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\Validator\Constraints as Assert;


#[Vich\Uploadable]
#[ORM\Entity(repositoryClass: BlogRepository::class)]


class Blog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $titre = null;

    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[ORM\Column(length: 2555, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $datepub = null;

    #[ORM\Column(length: 2555, nullable: true)]
    private ?string $image = null;
    #[Vich\UploadableField(mapping: 'product_images', fileNameProperty: 'image')]
    private ?File $imageFile = null;
    

    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $lieu = null;

    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[Assert\Positive(message: 'le rate doit etre positive!!')]

    #[ORM\Column(nullable: true)]
    private ?float $rate = null;

    #[ORM\OneToMany(mappedBy: 'idblog', targetEntity: Commentaire::class, cascade: ['remove'])]
    private Collection $commentaires;

    #[ORM\ManyToOne(inversedBy: 'idblog')]
    private ?Categorieblogs $categorieblogs = null;

    #[ORM\ManyToOne(inversedBy: 'blogs')]
    private ?Admin $idadmin = null;

    public function __construct()
    {
        $this->commentaires = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(?string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDatepub(): ?\DateTimeInterface
    {
        return $this->datepub;
    }

    public function setDatepub(\DateTimeInterface $datepub): self
    {
        $this->datepub = $datepub;

        return $this;
    }
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't be called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }
    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getLieu(): ?string
    {
        return $this->lieu;
    }

    public function setLieu(?string $lieu): static
    {
        $this->lieu = $lieu;

        return $this;
    }

    public function getRate(): ?float
    {
        return $this->rate;
    }
/**
     * @return int Le nombre de commentaires associés à ce blog
     */
    public function countComments(): int
    {
        return $this->commentaires->count();
    }
    public function setRate(?float $rate): static
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * @return Collection<int, Commentaire>
     */
    public function getCommentaires(): Collection
    {
        return $this->commentaires;
    }

    public function addCommentaire(Commentaire $commentaire): static
    {
        if (!$this->commentaires->contains($commentaire)) {
            $this->commentaires->add($commentaire);
            $commentaire->setIdblog($this);
        }

        return $this;
    }

    public function removeCommentaire(Commentaire $commentaire): static
    {
        if ($this->commentaires->removeElement($commentaire)) {
            // set the owning side to null (unless already changed)
            if ($commentaire->getIdblog() === $this) {
                $commentaire->setIdblog(null);
            }
        }

        return $this;
    }

    public function getCategorieblogs(): ?Categorieblogs
    {
        return $this->categorieblogs;
    }

    public function setCategorieblogs(?Categorieblogs $categorieblogs): static
    {
        $this->categorieblogs = $categorieblogs;

        return $this;
    }

    public function getIdadmin(): ?Admin
    {
        return $this->idadmin;
    }

    public function setIdadmin(?Admin $idadmin): static
    {
        $this->idadmin = $idadmin;

        return $this;
    }
}
