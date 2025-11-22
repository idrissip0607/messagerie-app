import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Vérification des variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey || "",
  authDomain: process.env.NEXT_PUBLIC_authDomain || "",
  projectId: process.env.NEXT_PUBLIC_projectId || "",
  storageBucket: process.env.NEXT_PUBLIC_storageBucket || "",
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId || "",
  appId: process.env.NEXT_PUBLIC_appId || "",
};

// Vérifier que toutes les variables d'environnement requises sont présentes
const isFirebaseConfigValid = Object.values(firebaseConfig).every(
  (value) => value !== ""
);

// Initialize Firebase
const app = isFirebaseConfigValid ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;

// Ajout de commentaires pour expliquer la gestion des erreurs
// Si les variables d'environnement ne sont pas définies, l'authentification sera null
// Ce cas est géré dans les composants qui utilisent auth
