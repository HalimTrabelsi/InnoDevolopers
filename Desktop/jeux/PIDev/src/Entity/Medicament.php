<?php

namespace App\Entity;

use App\Repository\MedicamentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MedicamentRepository::class)]
class Medicament
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[Assert\Length(max: 255, maxMessage: 'La longueur maximale est de 255 caractères.')]
    private ?string $ref_med = null;

    #[ORM\ManyToOne(inversedBy: 'medicaments')]
    private ?Categorie $categorie = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[Assert\Length(max: 255, maxMessage: 'La longueur maximale est de 255 caractères.')]
    private ?string $nom_med = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    private ?\DateTimeInterface $date_amm = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    private ?\DateTimeInterface $date_expiration = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    private ?int $Qte = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[Assert\Length(max: 255, maxMessage: 'La longueur maximale est de 255 caractères.')]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Ce champ est obligatoire !!')]
    #[Assert\Length(max: 255, maxMessage: 'La longueur maximale est de 255 caractères.')]
    private ?string $etat = null;

    #[ORM\ManyToOne(inversedBy: 'medicaments')]
    private ?Pharmacien $idpharmacien = null;

    // Getters and setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRefMed(): ?string
    {
        return $this->ref_med;
    }

    public function setRefMed(string $ref_med): static
    {
        $this->ref_med = $ref_med;

        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function getNomMed(): ?string
    {
        return $this->nom_med;
    }

    public function setNomMed(string $nom_med): static
    {
        $this->nom_med = $nom_med;

        return $this;
    }

    public function getDateAmm(): ?\DateTimeInterface
    {
        return $this->date_amm;
    }

    public function setDateAmm(\DateTimeInterface $date_amm): static
    {
        $this->date_amm = $date_amm;

        return $this;
    }

    public function getDateExpiration(): ?\DateTimeInterface
    {
        return $this->date_expiration;
    }

    public function setDateExpiration(\DateTimeInterface $date_expiration): static
    {
        $this->date_expiration = $date_expiration;

        return $this;
    }

    public function getQte(): ?int
    {
        return $this->Qte;
    }

    public function setQte(int $Qte): static
    {
        $this->Qte = $Qte;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getEtat(): ?string
    {
        return $this->etat;
    }

    public function setEtat(string $etat): static
    {
        $this->etat = $etat;

        return $this;
    }

    public function getIdpharmacien(): ?Pharmacien
    {
        return $this->idpharmacien;
    }

    public function setIdpharmacien(?Pharmacien $idpharmacien): static
    {
        $this->idpharmacien = $idpharmacien;

        return $this;
    }
}
