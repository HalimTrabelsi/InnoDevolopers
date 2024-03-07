<?php

namespace App\Entity;

use App\Repository\EmploiRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmploiRepository::class)]
class Emploi
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $start = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $end = null;

    #[ORM\Column(length: 25555, nullable: true)]
    private ?string $description = null;

    #[ORM\OneToMany(mappedBy: 'emploi', targetEntity: rendezvous::class)]
    private Collection $idrendezvous;

    public function __construct()
    {
        $this->idrendezvous = new ArrayCollection();
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

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(?\DateTimeInterface $start): static
    {
        $this->start = $start;

        return $this;
    }

    public function getEnd(): ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setEnd(?\DateTimeInterface $end): static
    {
        $this->end = $end;

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

    /**
     * @return Collection<int, rendezvous>
     */
    public function getIdrendezvous(): Collection
    {
        return $this->idrendezvous;
    }

    public function addIdrendezvou(rendezvous $idrendezvou): static
    {
        if (!$this->idrendezvous->contains($idrendezvou)) {
            $this->idrendezvous->add($idrendezvou);
            $idrendezvou->setEmploi($this);
        }

        return $this;
    }

    public function removeIdrendezvou(rendezvous $idrendezvou): static
    {
        if ($this->idrendezvous->removeElement($idrendezvou)) {
            // set the owning side to null (unless already changed)
            if ($idrendezvou->getEmploi() === $this) {
                $idrendezvou->setEmploi(null);
            }
        }

        return $this;
    }
}
