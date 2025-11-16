import axios from "axios";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params; // on recupere l'id du user passé en params
    const { status } = await req.json();

    await axios.patch(`${process.env.DATABASE_URL}/users/${id}.json`, {
      status,
    });
    return NextResponse.json({ message: "ok" });
  } catch (error) {
    console.log(error);
    NextResponse.json({ message: "une erreur s'est produite" });
  }
};
