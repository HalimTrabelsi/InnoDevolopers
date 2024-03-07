<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240213132358 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE admin (id INT AUTO_INCREMENT NOT NULL, cin INT DEFAULT NULL, nom VARCHAR(255) DEFAULT NULL, prenom VARCHAR(255) DEFAULT NULL, genre TINYINT(1) DEFAULT NULL, datenaissance DATETIME DEFAULT NULL, numtel INT DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, role VARCHAR(255) DEFAULT NULL, password VARCHAR(255) DEFAULT NULL, interlock TINYINT(1) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE blog (id INT AUTO_INCREMENT NOT NULL, categorieblogs_id INT DEFAULT NULL, idadmin_id INT DEFAULT NULL, titre VARCHAR(255) DEFAULT NULL, description VARCHAR(2555) DEFAULT NULL, datepub DATETIME DEFAULT NULL, image VARCHAR(2555) DEFAULT NULL, lieu VARCHAR(255) DEFAULT NULL, rate DOUBLE PRECISION DEFAULT NULL, INDEX IDX_C0155143A20B1463 (categorieblogs_id), INDEX IDX_C0155143CEFECA1D (idadmin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE categorie (id INT AUTO_INCREMENT NOT NULL, nom_cat VARCHAR(255) NOT NULL, type_cat VARCHAR(255) NOT NULL, description_cat VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE categorieblogs (id INT AUTO_INCREMENT NOT NULL, titrecategorie VARCHAR(255) DEFAULT NULL, descriptioncategorie VARCHAR(2555) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commentaire (id INT AUTO_INCREMENT NOT NULL, idblog_id INT DEFAULT NULL, idadmin_id INT DEFAULT NULL, contenue VARCHAR(2555) DEFAULT NULL, jaime TINYINT(1) DEFAULT NULL, nejaimepas TINYINT(1) DEFAULT NULL, INDEX IDX_67F068BC5E42CF9 (idblog_id), INDEX IDX_67F068BCCEFECA1D (idadmin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dossiermedical (id INT AUTO_INCREMENT NOT NULL, resultatexamen VARCHAR(25555) DEFAULT NULL, antecedantpersonnelles VARCHAR(25555) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE emploi (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) DEFAULT NULL, start DATETIME DEFAULT NULL, end DATETIME DEFAULT NULL, description VARCHAR(25555) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE medecin (id INT AUTO_INCREMENT NOT NULL, cin INT DEFAULT NULL, nom VARCHAR(255) DEFAULT NULL, prenom VARCHAR(255) DEFAULT NULL, genre TINYINT(1) DEFAULT NULL, datenaissance DATETIME DEFAULT NULL, numtel INT DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, role VARCHAR(255) DEFAULT NULL, password VARCHAR(255) DEFAULT NULL, interlock TINYINT(1) DEFAULT NULL, specialite VARCHAR(255) DEFAULT NULL, etat TINYINT(1) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE medicament (id INT AUTO_INCREMENT NOT NULL, categorie_id INT DEFAULT NULL, idpharmacien_id INT DEFAULT NULL, ref_med VARCHAR(255) NOT NULL, nom_med VARCHAR(255) NOT NULL, date_amm DATE NOT NULL, date_expiration DATE NOT NULL, qte INT NOT NULL, description VARCHAR(255) NOT NULL, etat VARCHAR(255) NOT NULL, INDEX IDX_9A9C723ABCF5E72D (categorie_id), INDEX IDX_9A9C723AB6418165 (idpharmacien_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE ordonnance (id INT AUTO_INCREMENT NOT NULL, idpatient_id INT DEFAULT NULL, dateprescription DATETIME DEFAULT NULL, medecamentprescrit VARCHAR(25555) DEFAULT NULL, adresse VARCHAR(2555) DEFAULT NULL, renouvellement DATETIME DEFAULT NULL, INDEX IDX_924B326CA6208F43 (idpatient_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE patient (id INT AUTO_INCREMENT NOT NULL, cin INT DEFAULT NULL, nom VARCHAR(255) DEFAULT NULL, prenom VARCHAR(255) DEFAULT NULL, genre TINYINT(1) DEFAULT NULL, datenaissance DATETIME DEFAULT NULL, numtel INT DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, role VARCHAR(255) DEFAULT NULL, password VARCHAR(255) DEFAULT NULL, interlock TINYINT(1) DEFAULT NULL, numcarte INT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE pharmacien (id INT AUTO_INCREMENT NOT NULL, cin INT DEFAULT NULL, nom VARCHAR(255) DEFAULT NULL, prenom VARCHAR(255) DEFAULT NULL, genre TINYINT(1) DEFAULT NULL, datenaissance DATETIME DEFAULT NULL, numtel INT DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, role VARCHAR(255) DEFAULT NULL, password VARCHAR(255) DEFAULT NULL, interlock TINYINT(1) DEFAULT NULL, poste TINYINT(1) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rendezvous (id INT AUTO_INCREMENT NOT NULL, emploi_id INT DEFAULT NULL, idpatient_id INT DEFAULT NULL, daterendezvous DATETIME DEFAULT NULL, heurerendezvous DATETIME DEFAULT NULL, description VARCHAR(25555) DEFAULT NULL, file VARCHAR(2555) DEFAULT NULL, INDEX IDX_C09A9BA8EC013E12 (emploi_id), INDEX IDX_C09A9BA8A6208F43 (idpatient_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE blog ADD CONSTRAINT FK_C0155143A20B1463 FOREIGN KEY (categorieblogs_id) REFERENCES categorieblogs (id)');
        $this->addSql('ALTER TABLE blog ADD CONSTRAINT FK_C0155143CEFECA1D FOREIGN KEY (idadmin_id) REFERENCES admin (id)');
        $this->addSql('ALTER TABLE commentaire ADD CONSTRAINT FK_67F068BC5E42CF9 FOREIGN KEY (idblog_id) REFERENCES blog (id)');
        $this->addSql('ALTER TABLE commentaire ADD CONSTRAINT FK_67F068BCCEFECA1D FOREIGN KEY (idadmin_id) REFERENCES admin (id)');
        $this->addSql('ALTER TABLE medicament ADD CONSTRAINT FK_9A9C723ABCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE medicament ADD CONSTRAINT FK_9A9C723AB6418165 FOREIGN KEY (idpharmacien_id) REFERENCES pharmacien (id)');
        $this->addSql('ALTER TABLE ordonnance ADD CONSTRAINT FK_924B326CA6208F43 FOREIGN KEY (idpatient_id) REFERENCES patient (id)');
        $this->addSql('ALTER TABLE rendezvous ADD CONSTRAINT FK_C09A9BA8EC013E12 FOREIGN KEY (emploi_id) REFERENCES emploi (id)');
        $this->addSql('ALTER TABLE rendezvous ADD CONSTRAINT FK_C09A9BA8A6208F43 FOREIGN KEY (idpatient_id) REFERENCES patient (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE blog DROP FOREIGN KEY FK_C0155143A20B1463');
        $this->addSql('ALTER TABLE blog DROP FOREIGN KEY FK_C0155143CEFECA1D');
        $this->addSql('ALTER TABLE commentaire DROP FOREIGN KEY FK_67F068BC5E42CF9');
        $this->addSql('ALTER TABLE commentaire DROP FOREIGN KEY FK_67F068BCCEFECA1D');
        $this->addSql('ALTER TABLE medicament DROP FOREIGN KEY FK_9A9C723ABCF5E72D');
        $this->addSql('ALTER TABLE medicament DROP FOREIGN KEY FK_9A9C723AB6418165');
        $this->addSql('ALTER TABLE ordonnance DROP FOREIGN KEY FK_924B326CA6208F43');
        $this->addSql('ALTER TABLE rendezvous DROP FOREIGN KEY FK_C09A9BA8EC013E12');
        $this->addSql('ALTER TABLE rendezvous DROP FOREIGN KEY FK_C09A9BA8A6208F43');
        $this->addSql('DROP TABLE admin');
        $this->addSql('DROP TABLE blog');
        $this->addSql('DROP TABLE categorie');
        $this->addSql('DROP TABLE categorieblogs');
        $this->addSql('DROP TABLE commentaire');
        $this->addSql('DROP TABLE dossiermedical');
        $this->addSql('DROP TABLE emploi');
        $this->addSql('DROP TABLE medecin');
        $this->addSql('DROP TABLE medicament');
        $this->addSql('DROP TABLE ordonnance');
        $this->addSql('DROP TABLE patient');
        $this->addSql('DROP TABLE pharmacien');
        $this->addSql('DROP TABLE rendezvous');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
