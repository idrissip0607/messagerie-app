import { Contact } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    // Vérifier que DATABASE_URL est défini
    if (!process.env.DATABASE_URL) {
      console.error(
        "DATABASE_URL n'est pas défini dans les variables d'environnement"
      );
      return NextResponse.json(
        { message: "Configuration de la base de données manquante" },
        { status: 500 }
      );
    }

    const body: Contact = await req.json();

    // Vérifier que le corps de la requête contient un ID
    if (!body?.id) {
      return NextResponse.json(
        { message: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    // Vérifier que le corps de la requête contient un nom
    if (!body?.name) {
      return NextResponse.json(
        { message: "Nom utilisateur manquant" },
        { status: 400 }
      );
    }

    // Vérifier si un utilisateur avec le même nom existe déjà
    // Si oui, supprimer les doublons avant de créer/mettre à jour
    try {
      const usersResponse = await axios.get(
        `${process.env.DATABASE_URL}/users.json`
      );
      const usersData = usersResponse.data;

      if (usersData) {
        // Parcourir tous les utilisateurs pour trouver des doublons
        for (const [key, value] of Object.entries(usersData)) {
          const user = value as Contact;
          // Si un utilisateur avec le même nom existe mais avec un ID différent
          if (user.name === body.name && key !== body.id) {
            console.log(
              `Doublon trouvé et supprimé: ${key} pour l'utilisateur: ${body.name}`
            );
            // Supprimer l'utilisateur avec l'ID incorrect
            await axios.delete(`${process.env.DATABASE_URL}/users/${key}.json`);
          }
        }
      }
    } catch (error) {
      console.warn("Erreur lors de la vérification des doublons:", error);
    }

    // Sauvegarder l'utilisateur avec le bon ID
    await axios.patch(
      `${process.env.DATABASE_URL}/users/${body.id}.json`,
      body
    );

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'utilisateur :", error);
    return NextResponse.json(
      { message: "Erreur lors de la sauvegarde de l'utilisateur" },
      { status: 500 }
    );
  }
};
