import { Message } from "@/types";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body: Message = await req.json();
    await axios.put(`${process.env.DATABASE_URL}/messages/${body.id}.json`, body);

    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "une erreur s'est produite" });
  }
};
