const express = require('express');
const { registerUser , signInUser} = require('../controllers/userController');
const upload = require('../middelwares/uploadImage');
const router = express.Router();
const { User } = require('../models/user');


router.post('/sign-up', upload.single('image'), registerUser);
router.post('/sign-in', signInUser);

router.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });
  router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });

  
module.exports = router;
