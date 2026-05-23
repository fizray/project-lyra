import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { places } from "@/db/schema";

export type PlaceSort = "newest" | "rating";

export function normalizePlaceSort(value: string | string[] | undefined): PlaceSort {
  const sort = Array.isArray(value) ? value[0] : value;

  return sort === "rating" ? "rating" : "newest";
}

export async function getUserPlaces(userId: string, sort: PlaceSort = "newest") {
  const orderBy =
    sort === "rating" ? [desc(places.rating), desc(places.createdAt)] : [desc(places.createdAt)];

  return db
    .select()
    .from(places)
    .where(eq(places.userId, userId))
    .orderBy(...orderBy);
}
