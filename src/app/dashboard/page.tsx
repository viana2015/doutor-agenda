import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SignOutButton from "./components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  // Preciso verificar se o usuário tem um clinica
  const clinic = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });
  // Se não tem, redireciona para o clinic-form
  if (clinic.length === 0) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{session?.user?.email}</p>
      <SignOutButton label="Sair" />
    </div>
  );
};

export default DashboardPage;
