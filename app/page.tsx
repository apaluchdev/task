import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { sql } from "@vercel/postgres";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-left text-xl flex flex-col">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl border-b pb-2">Tasks</h1>
        </div>
        <div>
          <h2 className="scroll-m-20 text-1xl font-bold tracking-tight lg:text-2xl pb-4 pt-4">Priority</h2>

          <div className="ml-4 flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </div>
      </div>
    </main>
  );
}

async function Cart({ params }: { params: { user: string } }): Promise<JSX.Element> {
  const { rows } = await sql`SELECT * from CARTS where user_id=${params.user}`;

  return (
    <div>
      {rows.map((row) => (
        <div key={row.id}>
          {row.id} - {row.quantity}
        </div>
      ))}
    </div>
  );
}
