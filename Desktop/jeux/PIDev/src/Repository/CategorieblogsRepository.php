<?php

namespace App\Repository;

use App\Entity\Categorieblogs;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Categorieblogs>
 *
 * @method Categorieblogs|null find($id, $lockMode = null, $lockVersion = null)
 * @method Categorieblogs|null findOneBy(array $criteria, array $orderBy = null)
 * @method Categorieblogs[]    findAll()
 * @method Categorieblogs[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategorieblogsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Categorieblogs::class);
    }

//    /**
//     * @return Categorieblogs[] Returns an array of Categorieblogs objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Categorieblogs
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
