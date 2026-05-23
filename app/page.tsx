import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/places/empty-state";
import { PlaceList } from "@/components/places/place-list";
import { getUserPlaces, normalizePlaceSort } from "@/lib/queries/places";

type HomePageProps = {
  searchParams: Promise<{
    sort?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { userId } = await auth();
  const query = await searchParams;
  const sort = normalizePlaceSort(query.sort);

  if (!userId) {
    return (
      <main className="min-h-[calc(100vh-4rem)]">
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Lyra List</h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              A personal list of places worth returning to.
            </p>
          </div>

          <EmptyState
            action={
              <SignInButton mode="modal">
                <Button>Sign in</Button>
              </SignInButton>
            }
          />
        </section>
      </main>
    );
  }

  const userPlaces = await getUserPlaces(userId, sort);

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Lyra List</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              A personal list of places worth returning to.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant={sort === "rating" ? "default" : "outline"}>
              <Link href="/?sort=rating">
                <SlidersHorizontal data-icon="inline-start" />
                Sort by rating
              </Link>
            </Button>
            <Button asChild variant={sort === "newest" ? "default" : "outline"}>
              <Link href="/">Newest</Link>
            </Button>
            <Button asChild>
              <Link href="/places/new">
                <Plus data-icon="inline-start" />
                Add Place
              </Link>
            </Button>
          </div>
        </div>

        {userPlaces.length > 0 ? (
          <PlaceList places={userPlaces} currentUserId={userId} />
        ) : (
          <EmptyState
            action={
              <Button asChild>
                <Link href="/places/new">
                  <Plus data-icon="inline-start" />
                  Add Place
                </Link>
              </Button>
            }
          />
        )}
      </section>
    </main>
  );
}
