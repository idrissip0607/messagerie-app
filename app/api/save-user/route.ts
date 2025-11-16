import { Contact } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

export const PATCH = async (req:Request) => {
    try {
        const body : Contact = await req.json()
       await axios.patch(`${process.env.DATABASE_URL}/users/${body?.id}.json`, body)
        
        
            return  NextResponse.json({message : "ok"})
        
    } catch (error) {
        console.log(error);
      return  NextResponse.json({message: "une erreur s'est produite"})
        
    }
}