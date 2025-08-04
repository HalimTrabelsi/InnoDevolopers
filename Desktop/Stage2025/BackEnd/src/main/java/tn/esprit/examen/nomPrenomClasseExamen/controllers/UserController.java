package tn.esprit.examen.nomPrenomClasseExamen.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.examen.nomPrenomClasseExamen.entities.User;
import tn.esprit.examen.nomPrenomClasseExamen.services.UserService;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("affecteruser")
    public ResponseEntity<?> AffecterUserRole(@RequestBody User u, @RequestParam List<String> nomrole ){
        try{
            userService.AffecterUserRole(u,nomrole);
            return ResponseEntity.ok(200);
        }catch(Exception e){
            e.getCause().getMessage();

        }

    return null;
    }
}
