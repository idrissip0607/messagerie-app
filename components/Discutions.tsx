"use client";
import { Info, LogOut, MessageCircle, Phone, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Contact, Message } from "../types";
import MessageReceived from "./MessageReceived";
import SendMessage from "./SendMessage";
import { Logout } from "@/controllers/Logout";
import { useCurrentUserStore } from "@/store";
import axios from "axios";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { GetMessage } from "@/controllers/GetMessage";

// SWR fetcher function
// const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function Discutions({
  currentContact,
  contacts,
}: {
  currentContact: string;
  contacts: Contact[];
}) {
  const { currentUser } = useCurrentUserStore();
  const [messages , setMessages] = useState<Message[]>([])

  // Use SWR for data fetching with real-time updates
  // const { data, error, isLoading } = useSWR(
  //   currentUser ? `/api/get-all-messages/${currentUser.id}` : null,
  //   fetcher,
  //   {
  //     refreshInterval: 3000, // Refresh every 3 seconds
  //     dedupingInterval: 1000, // Dedupe requests within 1 second
  //     revalidateOnMount: true,
  //     revalidateOnFocus: true,
  //     revalidateOnReconnect: true,
  //   }
  // );

  //On ecoute en temps reels les messages reçus
    const { data, error, isLoading } = useSWR('/api/get-all-messages', GetMessage, {
            refreshInterval: 2000, // On vérifie si les données ont été mises à jour dans la DB toutes les 2s
        }
    );

  // Process messages from SWR data
  // const messages = data?.messages || [];

  // Function to refresh messages manually
  // const refreshMessages = () => {
  //   mutate(`/api/get-all-messages/${currentUser?.id}`);
  // };

  // Set up an interval to refresh messages periodically
  // useEffect(() => {
  //   if (currentUser) {
  //     const interval = setInterval(() => {
  //       refreshMessages();
  //     }, 3000);

  //     return () => clearInterval(interval);
  //   }
  // }, [currentUser]);

   useEffect(() => {

        //On filtre pour ne garder que les messages avec la personne qu'on est entrain de discuter
        if(data && Array.isArray(data) && data.length > 0 && currentUser) {

            const donnees: Message[] = data
            const filtre = donnees.filter(item => item.sender === currentUser?.id || item.recever === currentUser?.id)
            setMessages(filtre)
        }
    }, [data, currentUser])

    if(error) {
        console.log(error)
    }

  return (
    <>
      {currentUser ? (
        <div className="chat-main">
          <div className="chat-header">
            <div className="header-info">
              <div className="header-details">
                <div className="header-name">{currentUser?.name}</div>
                <div className="header-status">{currentUser?.status}</div>
              </div>
            </div>
            <div className="header-actions">
              <button className="header-btn">
                <Phone size={20} />
              </button>
              <Link href={`/video-call/${currentUser?.id}`} className="header-btn">
                <Video size={20} />
              </Link>
              <button className="header-btn">
                <Info size={20} />
              </button>
              <button
                type="button"
                title="btn"
                onClick={() => Logout()}
                className="header-btn"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <MessageReceived messages={messages}  />
          <SendMessage messages={messages} setMessages={setMessages} />
        </div>
      ) : (
        <div className="flex gap-4 flex-col justify-center items-center h-screen w-screen">
          <MessageCircle size={60} />
          <h1 className="text-black font-bold text-4xl">Commencer le Chat</h1>
          <p className="text-gray-500">
            Selectionnez un ami a gauche dans la side barre
          </p>
        </div>
      )}
    </>
  );
}

export default Discutions;
