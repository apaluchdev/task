import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const petName = searchParams.get("petName");
  const ownerName = searchParams.get("ownerName");

  // Isn't it a security risk to embed text into SQL queries? – Not in this case.
  // Vercel sanitizes all queries sent to your Vercel Postgres database before executing them.
  // The below code does not expose you to SQL injections.
  try {
    if (!petName || !ownerName) throw new Error("Pet and owner names required");
    await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const pets = await sql`SELECT * FROM Pets;`;
  return NextResponse.json({ pets }, { status: 200 });
}
