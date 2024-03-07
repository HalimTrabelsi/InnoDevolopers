<?php

namespace App\Entity;

use App\Repository\RendezvousRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RendezvousRepository::class)]
class Rendezvous
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $daterendezvous = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $heurerendezvous = null;

    #[ORM\Column(length: 25555, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 2555, nullable: true)]
    private ?string $file = null;

    #[ORM\ManyToOne(inversedBy: 'idrendezvous')]
    private ?Emploi $emploi = null;

    #[ORM\ManyToOne(inversedBy: 'rendezvouses')]
    private ?Patient $idpatient = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDaterendezvous(): ?\DateTimeInterface
    {
        return $this->daterendezvous;
    }

    public function setDaterendezvous(?\DateTimeInterface $daterendezvous): static
    {
        $this->daterendezvous = $daterendezvous;

        return $this;
    }

    public function getHeurerendezvous(): ?\DateTimeInterface
    {
        return $this->heurerendezvous;
    }

    public function setHeurerendezvous(?\DateTimeInterface $heurerendezvous): static
    {
        $this->heurerendezvous = $heurerendezvous;

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

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(?string $file): static
    {
        $this->file = $file;

        return $this;
    }

    public function getEmploi(): ?Emploi
    {
        return $this->emploi;
    }

    public function setEmploi(?Emploi $emploi): static
    {
        $this->emploi = $emploi;

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
