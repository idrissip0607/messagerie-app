"use client";
import { Contact } from "@/types";
import { useCurrentUserStore, useUserStore } from "@/store";
import { useEffect, useState } from "react";
import { GetAllUsers } from "@/controllers/GetAllUsers";
import useSWR from "swr";
import { handleVisibilityChange } from "@/controllers/handleVisibilityChange";
import { handleBeforeUnload } from "@/controllers/handleBeforeUnload";

function Amis() {
  const { currentUser, setCurrentUser } = useCurrentUserStore();
  const [me, setMe] = useState("");
  const { users, setUsers } = useUserStore();
  const { data, error, isLoading } = useSWR("/api/get-users", GetAllUsers, {
    refreshInterval: 2000,
  });

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setUsers(data);
    }
  }, [data, setUsers]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")!).id || null;
    if (user) {
      setMe(user);
    }
  }, []);

  // a revoir explicitement
  useEffect(() => {
    // ✅ Vérifie bien qu'on est dans le navigateur
    if (typeof window !== "undefined") {
      // ✅ Ajout des écouteurs d’événements
      document.addEventListener("visibilitychange", () =>
        handleVisibilityChange(me)
      ); //Quand on change l'onglet
      window.addEventListener("beforeunload", () => handleBeforeUnload(me)); //Quand on ferme l'application ou le navigateur

      // ✅ Nettoyage des écouteurs
      return () => {
        document.removeEventListener("visibilitychange", () =>
          handleVisibilityChange(me)
        );
        window.removeEventListener("beforeunload", () =>
          handleBeforeUnload(me)
        );
      };
    }
  }, [me]);

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Discussions</h2>
      </div>

      <div className="sidebar-contacts">
        {users.map(
          (contact) =>
            contact?.id !== me && (
              <button
                key={contact.name}
                className={`contact-item ${
                  currentUser === contact.name ? "active" : ""
                }`}
                onClick={() => setCurrentUser(contact)}
              >
                <div className="contact-avatar">
                  {contact?.name![0]}
                  <span
                    className={`contact-status-dot ${
                      contact?.status === "en ligne"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact?.name!}</div>
                  <div className="contact-status">{contact?.status!}</div>
                </div>
              </button>
            )
        )}
      </div>
    </div>
  );
}

export default Amis;
