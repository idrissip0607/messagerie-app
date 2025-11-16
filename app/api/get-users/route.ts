import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const req = await axios.get(`${process.env.DATABASE_URL}/users.json`);
    const users = Object.values(req?.data)

    return NextResponse.json({ users: users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "une erreur s'est produite" });
  }
};
