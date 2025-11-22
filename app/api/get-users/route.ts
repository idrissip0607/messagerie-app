import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
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

    const response = await axios.get(`${process.env.DATABASE_URL}/users.json`);

    // Vérifier que la réponse contient des données
    if (!response?.data) {
      return NextResponse.json({ users: [] });
    }

    // Convertir les données Firebase en tableau d'utilisateurs en préservant les IDs
    const users = Object.entries(response.data).map(([key, value]) => ({
      ...(value as any),
      id: (value as any).id || key, // Utiliser l'ID de l'utilisateur ou la clé Firebase
    }));

    // Supprimer les doublons en vérifiant les noms d'utilisateur
    const uniqueUsers = users.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.name === user.name)
    );

    return NextResponse.json({ users: uniqueUsers });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
};
