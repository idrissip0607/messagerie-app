"use client";
import { useCurrentUserStore } from "@/store";
import { Message } from "@/types";
import { useEffect, useState, useRef } from "react";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function MessageReceived({ messages }: { messages: Message[] }) {
  const [user, setUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useCurrentUserStore();

  useEffect(() => {
        if (typeof window !== undefined) {

            Fancybox.bind("[data-fancybox]", {}); //On initialise Fancybox

            const id = JSON.parse(localStorage.getItem("user")!)?.id || ""
            setUser(id)
        }
    }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = JSON.parse(localStorage.getItem("user")!)?.id || "";
      setUser(id);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Créer un ensemble d'IDs uniques pour éviter les doublons
  const uniqueMessages = messages.reduce((acc: Message[], message: Message) => {
    // Vérifier si un message avec le même ID existe déjà
    const exists = acc.find((msg) => msg.id === message.id);
    if (!exists) {
      acc.push(message);
    }
    return acc;
  }, []);

  return (
    <div className="messages-container">
      {uniqueMessages.map((message, index) => (
        <div
          // Utiliser une combinaison de l'ID du message et de l'index pour garantir l'unicité
          key={`${message.id}-${index}`}
          className={`message-wrapper ${
            message.sender === user ? "sent" : "received"
          }`}
        >
          <div className="message-bubble w-full">
            <div className="message-text">
              {message.time &&
              message.text.includes("http") &&
              message.text.includes(".webp") ? (
                <a href={message.text || ""} data-fancybox>
                  <img src={message.text || ""} alt="" />
                </a>
              ) : message.text.includes("webm") ? (
                <audio
                src={message.text || ""}
                controls
                className="w-full mb-3"
              ></audio>
              ) : (message.text)}
            </div>
            <div className="message-time">{message.time}</div>
            <div className="message-time">
              {message.sender !== user && currentUser?.name}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageReceived;
