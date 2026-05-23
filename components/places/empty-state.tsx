import type { ReactNode } from "react";

type EmptyStateProps = {
  action?: ReactNode;
};

export function EmptyState({ action }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 py-12 text-center">
      <h2 className="text-xl font-semibold">No places yet.</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Start building your personal list of places worth returning to.
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
