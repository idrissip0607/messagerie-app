import { Contact, Message } from "@/types"
import axios from "axios"

export const GetMessage = async (url: string) => {

    if (typeof window !== undefined) {
        const idUser = JSON.parse(localStorage.getItem("user")!)?.id || null

        try {
            const req = await axios.get(`${url}/${idUser}`)

            if (!req?.data?.discutions) {
                return []
            }

            return req?.data?.discutions
            
        } catch (error) {
            console.log(error)
        }
    }
} 