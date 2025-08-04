package tn.esprit.examen.nomPrenomClasseExamen.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.examen.nomPrenomClasseExamen.entities.Role;
import tn.esprit.examen.nomPrenomClasseExamen.entities.User;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.RoleRepository;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;

    public User AffecterUserRole(User user, List<String> roles){

        User u=userRepository.findById(user.getId()).get();

        if (u==null){
            System.out.println("User nexiste pas ");
            return u;
        }
        List<Role>lr=roleRepository.findAllByNomRoleIn(roles);
        u.setRoles(lr);
        userRepository.save(u);

        return u;
    }

    public User SearchByIdentifiantOuNom(String identifiantNom){
        return null;
    }
}
