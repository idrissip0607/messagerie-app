import { auth } from "@/firebase/config";
import { Contact } from "@/types";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { saveUser } from "./SaveUser";

export const Login = async (router: AppRouterInstance) => {
    try {
         const provider = new GoogleAuthProvider()
         const  data = await signInWithPopup(auth,provider)
         const user = data?.user
         const body : Contact = {
            name : user?.displayName!,
            id : user?.uid,
            status : "en ligne"
         }

         saveUser(router,body)

    } catch (error) {
        console.log(error);
        
    }
}