"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/types";
import Amis from "@/components/Amis";
import Discutions from "@/components/Discutions";
import { useRouter } from "next/navigation";
import { LoginMiddleware } from "@/controllers/LoginMiddleware";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  const [currentContact, setCurrentContact] = useState("");

  const contacts: Contact[] = [];

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LoginMiddleware(router, setLoading, "chat");
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <p className="text-2xl">chargement...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <Amis />
      <Discutions contacts={contacts} currentContact={currentContact} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
