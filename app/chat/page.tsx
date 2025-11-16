"use client";

import { useEffect, useState } from "react";
import { Contact } from "@/types";
import Amis from "@/components/Amis";
import Discutions from "@/components/Discutions";
import { useRouter } from "next/navigation";
import { LoginMiddleware } from "@/controllers/LoginMiddleware";

function App() {
  const [currentContact, setCurrentContact] = useState("Marie");

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
    </div>
  );
}

export default App;
