import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
      <Link href="/" className="min-w-0">
        <span className="block truncate text-sm font-semibold">Lyra List</span>
        <span className="hidden text-xs text-muted-foreground sm:block">
          A personal list of places worth returning to.
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button size="sm">Sign in</Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
