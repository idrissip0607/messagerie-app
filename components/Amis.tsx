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
    // Vérifier que nous sommes dans le navigateur avant d'accéder à localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user?.id) {
            setMe(user.id);
          }
        } catch (error) {
          console.error(
            "Erreur lors du parsing de l'utilisateur depuis localStorage :",
            error
          );
        }
      }
    }
  }, []);

  // Fonction pour gérer le changement de visibilité
  const handleVisibilityChangeWrapper = () => {
    if (me) {
      handleVisibilityChange(me);
    }
  };

  // Fonction pour gérer le beforeunload
  const handleBeforeUnloadWrapper = () => {
    if (me) {
      handleBeforeUnload(me);
    }
  };

  // Gestion correcte des écouteurs d'événements
  useEffect(() => {
    // Vérifier que nous sommes dans le navigateur
    if (typeof window !== "undefined" && me) {
      // Ajout des écouteurs d'événements avec les fonctions wrapper
      const visibilityHandler = () => handleVisibilityChangeWrapper();
      const beforeUnloadHandler = () => handleBeforeUnloadWrapper();

      document.addEventListener("visibilitychange", visibilityHandler);
      window.addEventListener("beforeunload", beforeUnloadHandler);

      // Nettoyage des écouteurs lors du démontage du composant
      return () => {
        document.removeEventListener("visibilitychange", visibilityHandler);
        window.removeEventListener("beforeunload", beforeUnloadHandler);
      };
    }
  }, [me]); // Dépendance sur 'me' pour réinitialiser les écouteurs quand il change

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
                key={contact.id || contact.name} // Utiliser l'ID si disponible, sinon le nom
                className={`contact-item ${
                  currentUser?.id === contact.id ? "active" : ""
                }`}
                onClick={() => setCurrentUser(contact)}
              >
                <div className="contact-avatar">
                  {contact?.name?.[0] || "?"}
                  <span
                    className={`contact-status-dot ${
                      contact?.status === "en ligne"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div className="contact-info">
                  <div className="contact-name">
                    {contact?.name || "Utilisateur"}
                  </div>
                  <div className="contact-status">
                    {contact?.status || "hors-ligne"}
                  </div>
                </div>
              </button>
            )
        )}
      </div>
    </div>
  );
}

export default Amis;
