<?php

namespace App\Entity;

use App\Repository\OrdonnanceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrdonnanceRepository::class)]
class Ordonnance
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $dateprescription = null;

    #[ORM\Column(length: 25555, nullable: true)]
    private ?string $medecamentprescrit = null;

    #[ORM\Column(length: 2555, nullable: true)]
    private ?string $adresse = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $renouvellement = null;

    #[ORM\ManyToOne(inversedBy: 'ordonnances')]
    private ?patient $idpatient = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateprescription(): ?\DateTimeInterface
    {
        return $this->dateprescription;
    }

    public function setDateprescription(?\DateTimeInterface $dateprescription): static
    {
        $this->dateprescription = $dateprescription;

        return $this;
    }

    public function getMedecamentprescrit(): ?string
    {
        return $this->medecamentprescrit;
    }

    public function setMedecamentprescrit(?string $medecamentprescrit): static
    {
        $this->medecamentprescrit = $medecamentprescrit;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(?string $adresse): static
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getRenouvellement(): ?\DateTimeInterface
    {
        return $this->renouvellement;
    }

    public function setRenouvellement(?\DateTimeInterface $renouvellement): static
    {
        $this->renouvellement = $renouvellement;

        return $this;
    }

    public function getIdpatient(): ?patient
    {
        return $this->idpatient;
    }

    public function setIdpatient(?patient $idpatient): static
    {
        $this->idpatient = $idpatient;

        return $this;
    }
}
