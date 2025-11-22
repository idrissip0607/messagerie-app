import { Message } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
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

    const body: Message = await req.json();

    // Vérifier que le corps de la requête contient un ID
    if (!body?.id) {
      return NextResponse.json(
        { message: "ID du message manquant" },
        { status: 400 }
      );
    }

    await axios.put(
      `${process.env.DATABASE_URL}/messages/${body.id}.json`,
      body
    );

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
};
