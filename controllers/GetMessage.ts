import { Contact, Message } from "@/types";
import axios from "axios";

export const getMessage = async (
  currentUser: Contact | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  url: string
) => {
  if (typeof window !== "undefined") {
    const id = (await JSON.parse(localStorage.getItem("user")!)?.id) || null;
    try {
      const req = await axios.get(`${url}/${id}`);

      if (req?.data) {
        setMessages([]);
      }

      const data: Message[] = req?.data.messages;
      const filtre = data.filter(
        (item) =>
          item.sender === currentUser?.id || item.recever === currentUser?.id
      );
      setMessages(filtre);
    } catch (error) {
      console.log(error);
    }
  }
};
