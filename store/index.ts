import { Contact } from "@/types";
import { create } from "zustand";

type UserStore = {
  users: Contact[];
  setUsers: (item: Contact[]) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  setUsers: (item: Contact[]) => set({ users: item }),
}));



// --------------------------------------------------------------------------

// store pour afficher l'user avec qui on discute

type CurrentUserStore = {
  currentUser: Contact | null;
  setCurrentUser: (user: Contact) => void;
};

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user: Contact) => set({ currentUser: user }),
}));
