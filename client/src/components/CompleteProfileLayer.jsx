import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const CompleteProfileLayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    image: null
  });
  const [userId, setUserId] = useState(null);

  // Récupérer userId depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("userId");
    setUserId(id);
    console.log("User ID récupéré :", id); // Vérification
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si userId est bien récupéré
    if (!userId) {
      alert("ID utilisateur manquant !");
      return;
    }

    // Vérifier la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérifier la complexité du mot de passe
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      alert("Le mot de passe doit contenir au moins 8 caractères, avec au moins une lettre et un chiffre.");
      return;
    }

    // Préparer les données à envoyer
    const data = new FormData();
    data.append("userId", userId.toString()); // Conversion explicite
    data.append("phoneNumber", formData.phoneNumber);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append("role", formData.role);
    if (formData.image) {
      data.append("image", formData.image);
    }

    console.log("User ID envoyé :", data.get("userId")); // Vérification avant l'envoi

    // Envoyer les données au serveur
    try {
      const response = await axios.post("http://localhost:5001/auth/complete-profile", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(response.data.message);
      navigate("/sign-in");
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="container">
      <h2>Complétez votre inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-20'>
          <div className='position-relative'>
            <div className='icon-field'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='solar:lock-password-outline' />
              </span>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='form-control h-56-px bg-neutral-50 radius-12'
                id='your-password'
                placeholder='Mot de passe'
                required
              />
            </div>
          </div>
          <span className='mt-12 text-sm text-secondary-light'>
            Votre mot de passe doit contenir au moins 8 caractères
          </span>
        </div>

        <div className='mb-20'>
          <div className='position-relative'>
            <div className='icon-field'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='solar:lock-password-outline' />
              </span>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='form-control h-56-px bg-neutral-50 radius-12'
                id='confirm-password'
                placeholder='Confirmer le mot de passe'
                required
              />
            </div>
          </div>
          <span className='mt-12 text-sm text-secondary-light'>
            Assurez-vous que les mots de passe correspondent.
          </span>
        </div>

        <div className='icon-field mb-16'>
          <span className='icon top-50 translate-middle-y'>
            <Icon icon='mdi:phone' />
          </span>
          <input
            type='text'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            className='form-control h-56-px bg-neutral-50 radius-12'
            placeholder='Numéro de téléphone'
            required
          />
        </div>

        <div className='icon-field mb-16'>
          <span className='icon top-50 translate-middle-y'>
            <Icon icon='mdi:account' />
          </span>
          <select
            name='role'
            value={formData.role}
            onChange={handleChange}
            className='form-control h-56-px bg-neutral-50 radius-12'
            required
          >
            <option value=''>Sélectionnez un rôle</option>
            <option value='Business owner'>Business owner</option>
            <option value='Financial manager'>Financial manager</option>
            <option value='Accountant'>Accountant</option>
            <option value='Admin'>Admin</option>
          </select>
        </div>

        <div className='icon-field mb-16'>
          <span className='icon top-50 translate-middle-y'>
            <Icon icon='mdi:image' />
          </span>
          <input
            type='file'
            name='image'
            onChange={handleFileChange}
            className='form-control h-56-px bg-neutral-50 radius-12'
          />
        </div>

        <button type="submit" className='btn btn-primary'>Enregistrer</button>
      </form>
    </div>
  );
};

export default CompleteProfileLayer;
