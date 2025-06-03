"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { clinicFormSchema } from "@/app/clinic-form/form";
import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (
  values: z.infer<typeof clinicFormSchema>,
) => {
  const { name } = values;

  // Verifica se o usuário esta logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado.");
  }

  const [clinic] = await db.insert(clinicsTable).values({ name }).returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });
  revalidatePath("/clinics");
  return clinic;
};
