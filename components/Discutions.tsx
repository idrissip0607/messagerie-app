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

// SWR fetcher function
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function Discutions({
  currentContact,
  contacts,
}: {
  currentContact: string;
  contacts: Contact[];
}) {
  const { currentUser } = useCurrentUserStore();

  // Use SWR for data fetching with real-time updates
  const { data, error, isLoading } = useSWR(
    currentUser ? `/api/get-all-messages/${currentUser.id}` : null,
    fetcher,
    {
      refreshInterval: 3000, // Refresh every 3 seconds
      dedupingInterval: 1000, // Dedupe requests within 1 second
      revalidateOnMount: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // Process messages from SWR data
  const messages = data?.messages || [];

  // Function to refresh messages manually
  const refreshMessages = () => {
    mutate(`/api/get-all-messages/${currentUser?.id}`);
  };

  // Set up an interval to refresh messages periodically
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        refreshMessages();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentUser]);

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
          <SendMessage refreshMessages={refreshMessages} />
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
