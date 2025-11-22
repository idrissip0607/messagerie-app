import { getUploadAuthParams } from "@imagekit/next/server";

export const GET = async () => {
  // Vérifier que les clés ImageKit sont définies
  if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY) {
    console.error(
      "Clés ImageKit manquantes dans les variables d'environnement"
    );
    return Response.json(
      { message: "Configuration ImageKit manquante" },
      { status: 500 }
    );
  }

  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    });

    return Response.json({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la génération des paramètres d'authentification ImageKit :",
      error
    );
    return Response.json(
      {
        message:
          "Erreur lors de la génération des paramètres d'authentification",
      },
      { status: 500 }
    );
  }
};
