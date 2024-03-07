<?php

namespace App\Entity;

use App\Repository\DossiermedicalRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DossiermedicalRepository::class)]
class Dossiermedical
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 25555, nullable: true)]
    private ?string $resultatexamen = null;

    #[ORM\Column(length: 25555, nullable: true)]
    private ?string $antecedantpersonnelles = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getResultatexamen(): ?string
    {
        return $this->resultatexamen;
    }

    public function setResultatexamen(?string $resultatexamen): static
    {
        $this->resultatexamen = $resultatexamen;

        return $this;
    }

    public function getAntecedantpersonnelles(): ?string
    {
        return $this->antecedantpersonnelles;
    }

    public function setAntecedantpersonnelles(?string $antecedantpersonnelles): static
    {
        $this->antecedantpersonnelles = $antecedantpersonnelles;

        return $this;
    }
}
