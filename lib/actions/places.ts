"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { places } from "@/db/schema";
import { placeSchema } from "@/lib/validations/place";

export async function createPlace(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const raw = {
    name: formData.get("name"),
    rating: formData.get("rating"),
    note: formData.get("note") || undefined,
    address: formData.get("address") || undefined,
    visitedDate: formData.get("visitedDate") || undefined,
    latitude: formData.get("latitude") || undefined,
    longitude: formData.get("longitude") || undefined,
  };

  const validated = placeSchema.safeParse(raw);

  if (!validated.success) {
    throw new Error("Invalid input");
  }

  await db.insert(places).values({
    userId,
    name: validated.data.name,
    rating: validated.data.rating,
    note: validated.data.note || null,
    address: validated.data.address || null,
    visitedDate: validated.data.visitedDate || null,
    latitude: validated.data.latitude ?? null,
    longitude: validated.data.longitude ?? null,
  });

  revalidatePath("/");
  redirect("/");
}

export async function updatePlace(placeId: string, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [place] = await db.select().from(places).where(eq(places.id, placeId)).limit(1);

  if (!place) {
    throw new Error("Place not found");
  }

  if (place.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const raw = {
    name: formData.get("name"),
    rating: formData.get("rating"),
    note: formData.get("note") || undefined,
    address: formData.get("address") || undefined,
    visitedDate: formData.get("visitedDate") || undefined,
    latitude: formData.get("latitude") || undefined,
    longitude: formData.get("longitude") || undefined,
  };

  const validated = placeSchema.safeParse(raw);

  if (!validated.success) {
    throw new Error("Invalid input");
  }

  await db
    .update(places)
    .set({
      name: validated.data.name,
      rating: validated.data.rating,
      note: validated.data.note || null,
      address: validated.data.address || null,
      visitedDate: validated.data.visitedDate || null,
      latitude: validated.data.latitude ?? null,
      longitude: validated.data.longitude ?? null,
      updatedAt: new Date(),
    })
    .where(eq(places.id, placeId));

  revalidatePath("/");
  revalidatePath(`/places/${placeId}`);
  redirect(`/places/${placeId}`);
}

export async function deletePlace(placeId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [place] = await db.select().from(places).where(eq(places.id, placeId)).limit(1);

  if (!place) {
    throw new Error("Place not found");
  }

  if (place.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(places).where(eq(places.id, placeId));

  revalidatePath("/");
  redirect("/");
}
