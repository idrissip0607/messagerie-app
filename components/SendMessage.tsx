"use client";

import React, { useState } from "react";
import { Message } from "@/types";
import { Image, Loader, Mic, Send, SendHorizonal, X } from "lucide-react";
import { useCurrentUserStore } from "@/store";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { upload } from "@imagekit/next";
import AudioSend from "./AudioSend";
import { toast } from "react-toastify";

function SendMessage({ messages, setMessages }: {
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}) {
  const { currentUser } = useCurrentUserStore();
  const [newMessage, setNewMessage] = useState("");
  const [ecrire, setEcrire] = useState(false);
  const [files, setFiles] = useState<File | null>(null);
  const [preview, setPreview] = useState(""); // pour voir un aperçu de l'image
  const [load, setLoad] = useState(false);
  const [recording, setRecording] = useState(false); // État pour savoir si l'enregistrement audio est en cours

  const handleSendMessage = async (
    e?: React.FormEvent | null,
    url?: string | null
  ) => {
    try {
      e?.preventDefault();

      let textToSend = ""; // message à envoyer

      if (url && url !== "") {
        textToSend = url;
      } else {
        textToSend = newMessage;
      }

      if (textToSend === "") return;

      if (!url && newMessage.trim() === "") return;

      // Vérifier que l'utilisateur est connecté
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Utilisateur non connecté. Veuillez vous reconnecter.");
        return;
      }

      let userId = "";
      try {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser?.id || "";
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur :", error);
        toast.error(
          "Erreur lors de la récupération des informations utilisateur."
        );
        return;
      }

      if (!userId) {
        toast.error("ID utilisateur manquant.");
        return;
      }

      // Vérifier que l'utilisateur destinataire est sélectionné
      if (!currentUser?.id) {
        toast.error("Veuillez sélectionner un destinataire.");
        return;
      }

      const now = new Date();
      const time = `${now.getHours()}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const uniqueId = Date.now() + Math.floor(Math.random() * 10000);

      const message: Message = {
        id: uniqueId,
        text: textToSend,
        sender: JSON.parse(localStorage.getItem("user")!)?.id || "moi",
        recever: currentUser?.id,
        time,
      };

      await axios.post("/api/new-message", message);
      setMessages([...messages, message]);
      setNewMessage("");
      setEcrire(false);
      toast.success("Message envoyé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      toast.error("Échec de l'envoi du message. Veuillez réessayer.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    setEcrire(value.trim().length > 0);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target?.files?.[0];
    if (!fichier) return;

    setFiles(fichier);

    // Vérifier le type de fichier
    if (!fichier.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide.");
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (fichier.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB.");
      return;
    }

    // Convertir l'image en base64 pour voir son aperçu avant l'envoi
    const lien = URL.createObjectURL(fichier);
    setPreview(lien);
  };

  const UploadImageAvecImageKit = async () => {
    try {
      setLoad(true);

      // Vérifier qu'un fichier est sélectionné
      if (!files) {
        toast.error("Veuillez sélectionner une image.");
        return;
      }

      // Vérifier la taille du fichier
      if (files.size > 1024 * 1024) {
        toast.error("Veuillez sélectionner une image inférieure à 1MB.");
        return;
      }

      const response = await fetch("/api/imagekit-auth");
      const data = await response.json();

      // Vérifier la réponse de l'API
      if (!response.ok || data.message) {
        toast.error(
          data.message || "Erreur lors de l'authentification avec ImageKit."
        );
        return;
      }

      const { signature, expire, token, publicKey } = data;

      // Options de compression
      const options = {
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
      };

      // Convertir l'image en WebP
      const compressedImage = await imageCompression(files, options);

      // Envoi à imageKit.io
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file: compressedImage,
        fileName: `${Date.now()}.webp`,
      });

      // Vérifier la réponse du téléchargement
      if (!uploadResponse || !uploadResponse.url) {
        toast.error("Échec du téléchargement de l'image.");
        return;
      }

      console.log("Upload response:", uploadResponse.url);

      const url = uploadResponse.url; // On récupère l'url de l'image générée par imagekit.io

      // On envoie l'image au destinataire
      await handleSendMessage(null, url);
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image :", error);
      toast.error("Échec du téléchargement de l'image. Veuillez réessayer.");
    } finally {
      setLoad(false);
      setPreview("");
      setFiles(null);
    }
  };

  return (
    <div className="chat-input-area">
      <form
        onSubmit={handleSendMessage}
        className="input-form flex items-center gap-2"
      >
        {preview && preview !== "" ? (
          <div className=" bottom-full mb-2 bg-white rounded-lg shadow-lg p-2">
            <button
              type="button"
              onClick={() => {
                setPreview("");
                setFiles(null);
              }}
              aria-label="Supprimer l'aperçu"
              className="text-white text-sm mt-1 bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow transition-all duration-300"
            >
              <X size={16} />
            </button>
            <img
              src={preview}
              alt="Aperçu"
              className="max-w-xs max-h-48 rounded"
            />
            <div className="flex justify-end">
              {!load ? (
                <button
                  onClick={() => UploadImageAvecImageKit()}
                  type="button"
                  className="text-white text-sm mt-1 bg-green-500 hover:bg-green-700 btn flex items-center justify-center shadow transition-all duration-300"
                >
                  <SendHorizonal />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="text-white text-sm mt-1 bg-green-500 hover:bg-green-700 btn flex items-center justify-center shadow transition-all duration-300"
                >
                  <Loader />
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {!ecrire && (
              <>
                {!recording && (
                  <>
                    <input
                      type="file"
                      onChange={(e) => {
                        handleFile(e);
                      }}
                      id="file"
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="file"
                      className="send-button bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all duration-300"
                    >
                      <Image size={20} />
                    </label>
                  </>
                )}
              </>
            )}
            {!recording && (
              <input
                type="text"
                id="input"
                className="message-input flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Écrivez un message..."
                value={newMessage}
                onChange={handleInputChange}
              />
            )}

            {!ecrire ? (
              <AudioSend
                recording={recording}
                setRecording={setRecording}
                handleSendMessage={handleSendMessage}
              />
            ) : (
              <button
                type="submit"
                className="send-button bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-300"
              >
                <Send size={20} />
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default SendMessage;
