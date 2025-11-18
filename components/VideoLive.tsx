// "use client" indique à Next.js que ce fichier sera exécuté côté client (navigateur)
"use client"

// Import de React et des hooks principaux (useState, useEffect, useRef, useMemo)
import React, { useEffect, useMemo, useRef, useState } from "react";

// Import des composants et hooks du SDK VideoSDK pour gérer les réunions
import {
  MeetingProvider, // Fournit le contexte de la réunion à tous les enfants
  MeetingConsumer, // Permet de consommer ce contexte
  useMeeting,      // Hook pour interagir avec la réunion (join, leave, toggle mic/webcam)
  useParticipant,  // Hook pour obtenir les infos d'un participant
  VideoPlayer,     // Composant pour afficher la vidéo d'un participant
} from "@videosdk.live/react-sdk";
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";

// Token d'authentification fourni par VideoSDK (à remplacer par votre vrai token)
export const authToken = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;

// Fonction pour créer une réunion via l'API VideoSDK
const createMeeting = async () => {
  // Appel HTTP POST pour créer une salle (meeting)
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`, // Authentification via le token
      "Content-Type": "application/json", // Format JSON
    },
    body: JSON.stringify({}), // Corps vide, mais on pourrait ajouter des configs
  });

  // Récupération de l'ID de la salle depuis la réponse JSON
  const { roomId } = await res.json();
  return roomId; // Retourne l'ID de la réunion créée
};

// Composant pour permettre à l'utilisateur de rejoindre ou créer une réunion
function JoinScreen({ getMeetingAndToken } : { getMeetingAndToken: (meeting?: string) => void }) {
  const [meetingId, setMeetingId] = useState<string | null>(null); // Stocke l'ID saisi par l'utilisateur

  // Fonction appelée au clic sur le bouton
  const onClick = async () => {
    await getMeetingAndToken(meetingId!); // Appelle la fonction pour rejoindre ou créer une réunion
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      {/* Champ pour saisir l'ID d'une réunion existante */}
      <input
        type="text"
        placeholder="Entrez l'id de l'appel"
        onChange={(e) => {
          setMeetingId(e.target.value); // Met à jour l'état quand l'utilisateur tape
        }}
      />
      {/* Bouton pour rejoindre une réunion existante */}
      <button className="btn btn-error" onClick={onClick}>Rejoindre</button>
      <span>ou</span>
      {/* Bouton pour créer une nouvelle réunion */}
      <button className="btn btn-primary" onClick={onClick}>Appeler</button>
    </div>
  );
}



// Composant pour afficher un participant avec sa vidéo et son audio
function ParticipantView(props: { participantId: string}) {
  const micRef = useRef< HTMLAudioElement | null >(null); // Référence pour le lecteur audio
  const { micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId); // Récupère les infos du participant

  // Hook qui gère l'audio du participant
  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream(); // Création d'un flux média
        mediaStream.addTrack(micStream.track); // Ajout de la piste audio du participant

        micRef.current.srcObject = mediaStream; // Assigne le flux au lecteur audio
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error) // Gestion des erreurs
          );
      } else {
        micRef.current.srcObject = null; // Si le micro est éteint, on coupe l'audio
      }
    }
  }, [micStream, micOn]); // Se déclenche quand le flux ou l'état du micro change

  return (
    <div
  key={props.participantId}
  className={`card shadow-md bg-base-100 border border-base-200 p-4 mb-4 ${
    isLocal ? "bg-green-200" : "bg-gray-300"
  }`}
>

  {/* Audio du participant */}
  <audio ref={micRef} autoPlay muted={isLocal} />

  {/* Vidéo si webcam activée */}
  {webcamOn ? (
    <div className="rounded-lg overflow-hidden border border-base-300">
      <div className="font-semibold text-sm text-primary">
      👤 {JSON.parse(localStorage.getItem("user")!)?.name}
    </div>
      <VideoPlayer
        participantId={props.participantId}
        type="video"
        containerStyle={{
          height: "200px",
          width: "100%",
          marginBottom : "10px"
        }}
        className="h-full w-full"
        classNameVideo="h-full w-full object-cover"
        videoStyle={{}}
      />
    <div>
      <Controls webcamOn={webcamOn} micOn={micOn} />
    </div>
    </div>
  ) : (
    <div className="text-center text-sm text-gray-400 italic mt-2">
      Webcam désactivée
      <div>
      <Controls webcamOn={webcamOn} micOn={micOn} />
    </div>
    </div>
  )}
</div>
  );
} 

// Composant pour les contrôles (quitter, micro, webcam)
function Controls({micOn,webcamOn}: {micOn : boolean , webcamOn : boolean}) {
  const { leave, toggleMic, toggleWebcam } = useMeeting(); // Hooks pour contrôler la réunion
  return (
    <div className=" p-3 bg-black rounded-2xl flex justify-around">
      <button className="cursor-pointer  text-red-500 font-bold" onClick={() => leave()}> <PhoneOff /> </button> {/* Quitter la réunion */}
      <button className={`cursor-pointer font-bold ${micOn ? " text-red-500" : "text-white"}`} onClick={() => toggleMic()}> {micOn ? <MicOff /> : <Mic />} </button> {/* Activer/désactiver micro */}
      <button className={`cursor-pointer font-bold ${webcamOn ? " text-red-500" : " text-white"}`} onClick={() => toggleWebcam()}> {webcamOn ? <CameraOff /> : <Camera />} </button> {/* Activer/désactiver webcam */}
    </div>
  );
}




// Composant principal affichant la réunion et tous les participants
function MeetingView(props: {
  onMeetingLeave: () => void, // Callback quand la réunion est quittée
  meetingId: string,          // ID de la réunion
}) {
  const [joined, setJoined] = useState<string | null>(null); // Etat pour savoir si on a rejoint
  const { join } = useMeeting(); // Fonction pour rejoindre la réunion
  const { participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED"); // Mise à jour quand la réunion est rejointe
    },
    onMeetingLeft: () => {
      props.onMeetingLeave(); // Appelle la fonction parent quand on quitte
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING"); // Affiche "Joining..." avant d'être connecté
    join(); // Rejoint la réunion
  };

  return (
     <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col h-screen w-full items-center justify-center">
                <h3>Id de l'appel: {props.meetingId}</h3>
                {joined && joined == "JOINED" ? (
                    <div>
                        <div className="grid justify-center items-center grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Affiche tous les participants */}
                            {[...participants.keys()].map((participantId) => (
                                <ParticipantView
                                    participantId={participantId}
                                    key={participantId}
                                />
                            ))}
                        </div>
                    </div>
                ) : joined && joined == "JOINING" ? (
                    <p>Appel en cours...</p>
                ) : (
                    <button className="btn btn-primary" id="decrocheBtn" onClick={joinMeeting}>Repondre</button>
                )}
            </div>
        </div>
  );
}

// Composant principal qui gère la logique complète de la vidéo
export function VideoLive() {
  const [meetingId, setMeetingId] = useState(null); // Stocke l'ID de la réunion actuelle

  // Fonction pour récupérer ou créer une réunion
  const getMeetingAndToken = async (id?: string) => {
    const meetingId = id && id.trim().length > 0 ? id : await createMeeting();
    setMeetingId(meetingId); // Met à jour l'état avec l'ID
  };

  // Callback pour réinitialiser l'état après avoir quitté la réunion
  const onMeetingLeave = () => {
    setMeetingId(null);
  };

  // Si on a un token et un meetingId, on affiche la réunion, sinon l'écran de join
  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,   // Micro activé par défaut
        webcamEnabled: true, // Webcam activée par défaut
        name: "C.V. Raman",  // Nom du participant local
        debugMode: false,
      }}
      token={authToken} // Token pour rejoindre la réunion
    >
      <MeetingConsumer>
        {() => (
          <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  );
}

export default VideoLive; // Export par défaut du composant principal
