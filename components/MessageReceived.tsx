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
    if (typeof window !== "undefined") {
      // Initialiser Fancybox
      Fancybox.bind("[data-fancybox]", {});

      // Récupérer l'ID de l'utilisateur depuis localStorage
      const id = JSON.parse(localStorage.getItem("user")!)?.id || ""
      setUser(id)
    }
  }, []);

  // Auto-scroll vers le bas quand les messages changent
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
      {uniqueMessages.map((message) => (
        <div
          key={message.id} // Utiliser uniquement l'ID du message pour la clé
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
                  <img src={message.text || ""} alt="Image envoyée" />
                </a>
              ) : message.text.includes(".webm") ? (
                <audio
                  src={message.text || ""}
                  controls
                  className="w-full mb-3"
                ></audio>
              ) : (
                message.text
              )}
            </div>
            <div className="message-time">{message.time}</div>
            {message.sender !== user && (
              <div className="message-time">
                {currentUser?.name || "Utilisateur"}
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageReceived;
