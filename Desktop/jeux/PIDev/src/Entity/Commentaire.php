<?php

namespace App\Entity;

use App\Repository\CommentaireRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\DBAL\Types\Types;
#[ORM\Entity(repositoryClass: CommentaireRepository::class)]
class Commentaire
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups("commmentaires")]
    private ?int $id = null;


    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[ORM\Column(length: 2555, nullable: true)]
    private ?string $contenue = null;

    #[ORM\Column(nullable: true)]
    private ?bool $jaime = null;

    #[ORM\Column(nullable: true)]
    private ?bool $nejaimepas = null;
    #[ORM\Column]
    #[Groups("commmentaires")]

    private ?int $nblike = null;

    #[ORM\Column]
    #[Groups("commmentaires")]

    private ?int $nbdislike = null;

    #[ORM\ManyToOne(inversedBy: 'commentaires', cascade: ['remove'])]
    private ?Blog $idblog = null;

    #[ORM\ManyToOne(inversedBy: 'commentaires')]
    private ?Admin $idadmin = null;
    #[ORM\OneToMany(mappedBy: 'commentaire', targetEntity: Like::class, cascade: ['remove'])]
    private Collection $likes;

    #[ORM\OneToMany(mappedBy: 'commentaire', targetEntity: Dislike::class, cascade: ['remove'])]
    private Collection $dislikes;
    public function __construct()
    {
        $this->likes = new ArrayCollection();
        $this->dislikes = new ArrayCollection();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNblike(): ?int
    {
        return $this->nblike;
    }

    public function setNblike(int $nblike): self
    {
        $this->nblike = $nblike;

        return $this;
    }

    public function getNbdislike(): ?int
    {
        return $this->nbdislike;
    }

    public function setNbdislike(int $nbdislike): self
    {
        $this->nbdislike = $nbdislike;

        return $this;
    }

    /**
     * @return Collection<int, Like>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(Like $like): self
    {
        if (!$this->likes->contains($like)) {
            $this->likes->add($like);
            $like->setCommentaire($this);
        }

        return $this;
    }

    public function removeLike(Like $like): self
    {
        if ($this->likes->removeElement($like)) {
            // set the owning side to null (unless already changed)
            if ($like->getCommentaire() === $this) {
                $like->setCommentaire(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Dislike>
     */
    public function getDislikes(): Collection
    {
        return $this->dislikes;
    }

    public function addDislike(Dislike $dislike): self
    {
        if (!$this->dislikes->contains($dislike)) {
            $this->dislikes->add($dislike);
            $dislike->setCommentaire($this);
        }

        return $this;
    }

    public function removeDislike(Dislike $dislike): self
    {
        if ($this->dislikes->removeElement($dislike)) {
            // set the owning side to null (unless already changed)
            if ($dislike->getCommentaire() === $this) {
                $dislike->setCommentaire(null);
            }
        }

        return $this;
    }
   
  
    public function getContenue(): ?string
    {
        return $this->contenue;
    }

    public function setContenue(?string $contenue): static
    {
        $this->contenue = $contenue;

        return $this;
    }

    public function isJaime(): ?bool
    {
        return $this->jaime;
    }

    public function setJaime(?bool $jaime): static
    {
        $this->jaime = $jaime;

        return $this;
    }

    public function isNejaimepas(): ?bool
    {
        return $this->nejaimepas;
    }

    public function setNejaimepas(?bool $nejaimepas): static
    {
        $this->nejaimepas = $nejaimepas;

        return $this;
    }

    public function getIdblog(): ?blog
    {
        return $this->idblog;
    }

    public function setIdblog(?blog $idblog): static
    {
        $this->idblog = $idblog;

        return $this;
    }

    public function getIdadmin(): ?admin
    {
        return $this->idadmin;
    }

    public function setIdadmin(?admin $idadmin): static
    {
        $this->idadmin = $idadmin;

        return $this;
    }

   
}
