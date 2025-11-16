"use client"; // Indique que ce composant est un composant client dans Next.js
import React, { useState, useRef } from "react"; // Importation des modules nécessaires de React
import { Loader, Mic, Send, StopCircle } from "lucide-react";

import { upload } from "@imagekit/next";
function AudioSend({
  setRecording,
  recording,
  handleSendMessage,
}: {
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  recording: boolean;
  handleSendMessage: (e?: React.FormEvent<Element> | null | undefined, url?: string | null) => Promise<void>
}) {
  const [timer, setTimer] = useState(0); // État pour stocker le temps écoulé pendant l'enregistrement
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Référence pour l'objet MediaRecorder
  const audioChunks = useRef<Blob[]>([]); // Référence pour stocker les morceaux de données audio
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Référence pour le setInterval utilisé pour le minuteur
  const [audioBase64, setAudioBase64] = useState<string | null>(null); //Pour convertir l'audio en base64 pour le preview avant l'envoi au serveur

  const [audioBlobToSend, setAudioBlobToSend] = useState<Blob | null>(null); //L'audio à envoyé après enregristrement

  const [load, setLoad] = useState(false);

  const startRecording = async () => {
    setAudioBase64(null);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Demande l'accès au microphone de l'utilisateur
    mediaRecorderRef.current = new MediaRecorder(stream); // Crée une instance de MediaRecorder avec le flux audio
    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data); // Ajoute les données audio disponibles à la liste des morceaux
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" }); // Crée un Blob contenant les données audio

      setAudioBlobToSend(audioBlob); //Stock l'audio en format blob pour l'envoi à la db (imagekit)

      //On convertie le blob en base64
      const base = URL.createObjectURL(audioBlob);
      setAudioBase64(base);

      audioChunks.current = []; // Réinitialise les morceaux de données audio
    };

    mediaRecorderRef.current.start(); // Démarre l'enregistrement audio
    setRecording(true); // Met à jour l'état pour indiquer que l'enregistrement est en cours
    setTimer(0); // Réinitialise le minuteur à 0
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1); // Incrémente le minuteur toutes les secondes
    }, 1000); // Définit un intervalle pour mettre à jour le minuteur
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); // Arrête l'enregistrement audio
    if (timerRef.current) {
      clearInterval(timerRef.current); // Arrête le minuteur
      timerRef.current = null; // Réinitialise la référence du minuteur
    }
  };

  // Formater le temps écoulé en mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60); // Calcule le nombre de minutes
    const seconds = time % 60; // Calcule le nombre de secondes restantes
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`; // Retourne le temps formaté en mm:ss
  };

  //Pour envoyer l'audio dans la db imagekit
  const SendAudioToImageKit = async () => {
    try {
      setLoad(true);
      // Récupérer le token signé depuis ton serveur
      const response = await fetch("/api/imagekit-auth");
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;

      if (!audioBlobToSend) return alert("Aucun fichier audio sélectionné");
      if (audioBlobToSend.size > 10 * 1024 * 1024)
        return alert("Fichier audio trop volumineux (>10MB)");

      // Convertir le Blob en File (ImageKit préfère File, mais Blob fonctionne aussi)
      const audioFile = new File([audioBlobToSend], `${Date.now()}.webm`, {
        type: "audio/webm",
      });

      // Upload de l'audio à ImageKit
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file: audioFile,
        fileName: audioFile.name,
      });

      console.log("Upload response:", uploadResponse.url);
       const url = uploadResponse.url; //On recupère l'url de l'image générer par imagekit.io

      //On envoi l'image au destinataire
       await handleSendMessage(null, url)

      setRecording(false); //On remene le champs de saisie
    } catch (error) {
        console.log(error);
        return { message: "error" };
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      {/* Si l'enregistrement audio est en cours */}
      {recording ? (
        <div className="flex w-full justify-between items-center">
          {/* Si le preview de l'audio est disponible */}
          {audioBase64 && audioBase64 !== "" ? (
            <div className="flex justify-end flex-col w-full">
              <audio
                src={audioBase64 || ""}
                controls
                className="w-full mb-3"
              ></audio>
              {!load ? (
                <div className="flex items-center justify-end gap-5">
                  <button
                    onClick={() => setRecording(false)}
                    type="button"
                    className="btn rounded-3xl bg-red-500 hover:bg-red-400 text-white "
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => SendAudioToImageKit()}
                    className="btn rounded-3xl bg-green-500 hover:bg-green-400 text-white "
                  >
                    Envoyer
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                    <button
                  type="button"
                  className="btn rounded-3xl bg-green-500 hover:bg-green-400 text-white "
                  disabled
                >
                  <Loader />
                </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm">Enregistrement en cours...</p>
                <p>Temps écoulé : {formatTime(timer)}</p>
              </div>
              <button
                onClick={stopRecording}
                className="send-button bg-red-500 hover:bg-red-400"
              >
                <StopCircle />
              </button>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={startRecording}
          className="send-button bg-red-500 hover:bg-red-400"
        >
          <Mic size={20} />
        </button>
      )}
    </>
  );
}

export default AudioSend; // Exporte le composant pour pouvoir l'utiliser ailleurs
