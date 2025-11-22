import axios from "axios";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
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

    const { id } = await params;

    // Vérifier que l'ID est fourni
    if (!id) {
      return NextResponse.json(
        { message: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    // Vérifier que le statut est fourni
    if (status === undefined) {
      return NextResponse.json({ message: "Statut manquant" }, { status: 400 });
    }

    // Vérifier que l'utilisateur existe avant de mettre à jour
    try {
      const userResponse = await axios.get(
        `${process.env.DATABASE_URL}/users/${id}.json`
      );
      if (!userResponse.data) {
        console.warn(
          `Utilisateur avec ID ${id} non trouvé lors de la mise à jour du statut`
        );
        return NextResponse.json(
          { message: "Utilisateur non trouvé" },
          { status: 404 }
        );
      }
    } catch (userError) {
      console.warn(
        `Erreur lors de la vérification de l'existence de l'utilisateur ${id}:`,
        userError
      );
    }

    await axios.patch(`${process.env.DATABASE_URL}/users/${id}.json`, {
      status,
    });

    return NextResponse.json({ message: "ok" });
  } catch (error: any) {
    // Gérer les erreurs spécifiques
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      console.warn("La requête de mise à jour du statut a expiré");
      return NextResponse.json({ message: "Requête expirée" }, { status: 408 });
    }

    console.error("Erreur lors de la mise à jour du statut :", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
};
