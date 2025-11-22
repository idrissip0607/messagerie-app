import { auth } from "@/firebase/config";
import { Contact } from "@/types";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { saveUser } from "./SaveUser";

export const Login = async (router: AppRouterInstance) => {
  try {
    // Vérifier que l'authentification Firebase est disponible
    if (!auth) {
      alert(
        "Configuration Firebase manquante. Veuillez vérifier vos variables d'environnement."
      );
      return;
    }

    const provider = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, provider);
    const user = data?.user;

    // Vérifier que l'utilisateur a les informations nécessaires
    if (!user?.displayName || !user?.uid) {
      alert("Impossible de récupérer les informations utilisateur de Google.");
      return;
    }

    // Vérifier que l'UID Firebase est valide
    if (!user.uid || user.uid.length < 10) {
      alert("ID utilisateur Firebase invalide.");
      return;
    }

    // Vérifier si l'utilisateur existe déjà dans la base de données
    // Cela peut arriver si l'utilisateur se reconnecte
    try {
      const response = await axios.get(`/api/get-users`);
      const existingUsers = response.data.users || [];

      // Chercher un utilisateur avec le même UID
      const existingUser = existingUsers.find(
        (u: Contact) => u.id === user.uid
      );

      const body: Contact = {
        name: user.displayName,
        id: user.uid, // Toujours utiliser le Firebase UID comme ID
        status: "en ligne",
      };

      saveUser(router, body);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'utilisateur existant:",
        error
      );

      // Créer un nouvel utilisateur si la vérification échoue
      const body: Contact = {
        name: user.displayName,
        id: user.uid, // Toujours utiliser le Firebase UID comme ID
        status: "en ligne",
      };

      saveUser(router, body);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion avec Google :", error);
    alert("Échec de la connexion. Veuillez réessayer.");
  }
};
