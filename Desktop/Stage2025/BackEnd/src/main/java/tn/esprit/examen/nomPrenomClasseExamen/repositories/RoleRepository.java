package tn.esprit.examen.nomPrenomClasseExamen.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Role;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role,Long> {
  List<Role> findAllByNomRoleIn(List<String> nomRole);

}
