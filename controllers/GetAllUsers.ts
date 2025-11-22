import axios from "axios";

export const GetAllUsers = async (url: string) => {
  try {
    // Vérifier que l'URL est fournie
    if (!url) {
      console.error("URL manquante dans GetAllUsers");
      return [];
    }

    const req = await axios.get(url);

    // Vérifier la réponse de l'API
    if (!req?.data.users) {
      console.warn(
        "Aucun utilisateur trouvé ou erreur dans la réponse :",
        req?.data?.message
      );
      return [];
    }

    return req?.data.users;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    // Retourner un tableau vide en cas d'erreur au lieu d'afficher une alerte
    return [];
  }
};
