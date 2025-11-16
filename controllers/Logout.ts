import { auth } from "@/firebase/config";
import axios from "axios";
import { signOut } from "firebase/auth";

export const Logout = async () => {
  try {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const id = storedUser ? JSON.parse(storedUser)?.id : null;

      if (!id) {
        alert("utilisateur introuvable");
        return;
      }

      localStorage.removeItem("user"); // on supprime le user du local storage
      await signOut(auth); // on deconnecte le user de firebase
      const req = await axios.patch(`/api/update-status/${id}`, {
        status: "hors-ligne",
      });

      if (req?.data?.message === "ok") {
        return (location.href = "/");
      } else {
        alert("utilisateur non deconnecter");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
