import { Message } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const res = await axios.get(`${process.env.DATABASE_URL}/messages.json`);
    const data = res?.data;

    if (!data) {
      return NextResponse.json({ message: "aucun message trouvé" });
    }

    // Convertir les données Firebase en tableau de messages en préservant les IDs
    const messages: Message[] = Object.entries(data).map(([key, value]) => ({
      ...(value as Message),
      id: (value as Message).id || parseInt(key), // Utiliser l'ID du message ou la clé Firebase
    }));

    const filtreMessage = messages.filter(
      (item) => item.sender === id || item.recever === id
    );
    return NextResponse.json({ messages: filtreMessage });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "erreur" });
  }
};
