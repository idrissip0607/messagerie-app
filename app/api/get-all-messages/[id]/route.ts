// import { Message } from "@/types";
// import axios from "axios";
// import { NextResponse } from "next/server";

// export const GET = async (
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) => {
//   try {
//     // Vérifier que DATABASE_URL est défini
//     if (!process.env.DATABASE_URL) {
//       console.error(
//         "DATABASE_URL n'est pas défini dans les variables d'environnement"
//       );
//       return NextResponse.json(
//         { message: "Configuration de la base de données manquante" },
//         { status: 500 }
//       );
//     }

//     const { id } = await params;

//     // Vérifier que l'ID est fourni
//     if (!id) {
//       return NextResponse.json(
//         { message: "ID utilisateur manquant" },
//         { status: 400 }
//       );
//     }

//     const response = await axios.get(
//       `${process.env.DATABASE_URL}/messages.json`
//     );
//     const data = response?.data;

//     // Si aucune donnée n'est trouvée, retourner un tableau vide
//     if (!data) {
//       return NextResponse.json({ messages: [] });
//     }

//     // Convertir les données Firebase en tableau de messages en préservant les IDs
//     const messages: Message[] = Object.entries(data).map(([key, value]) => ({
//       ...(value as Message),
//       id: (value as Message).id || parseInt(key), // Utiliser l'ID du message ou la clé Firebase
//     }));

//     // Filtrer les messages pour l'utilisateur spécifié
//     const filteredMessages = messages.filter(
//       (item) => item.sender === id || item.recever === id
//     );

//     return NextResponse.json({ messages: filteredMessages });
//   } catch (error) {
//     console.error("Erreur lors de la récupération des messages :", error);
//     return NextResponse.json(
//       { message: "Erreur lors de la récupération des messages" },
//       { status: 500 }
//     );
//   }
// };

import { Message } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params} : { params: Promise<{ id: string}>}) => {
    try {
        const { id } = await params

         const data = await axios.get(`${process.env.database_url}/messages.json`)

        if(!data?.data) {
            return NextResponse.json({message: "Aucun message trouvé"})
        }

        const listeComplete: Message[] = Object.values(data?.data); //On convertie en tableau js les resultats

        //On filtre les messages par utilisateur (soit il est le sender ou le recever)
        const filtre = listeComplete.filter(item => item.sender === id || item.recever === id)

         return NextResponse.json({ discutions: filtre })

    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Erreur"})
    }
}