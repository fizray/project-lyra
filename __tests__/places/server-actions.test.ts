import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn() })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn(() => []) })) })),
    })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn() })) })),
    delete: vi.fn(() => ({ where: vi.fn() })),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { createPlace, updatePlace, deletePlace } from "@/lib/actions/places";

const mockAuth = auth as unknown as ReturnType<typeof vi.fn>;
const mockDb = db as unknown as {
  insert: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

function makeFormData(overrides: Record<string, string> = {}) {
  const defaults = {
    name: "Test Place",
    rating: "4",
    ...overrides,
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries(defaults)) {
    fd.set(k, v);
  }
  return fd;
}

const OWNER_ID = "user_owner_123";
const OTHER_ID = "user_other_456";
const PLACE_ID = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("5.5 Server Security — createPlace", () => {
  it("throws Unauthorized when signed out", async () => {
    mockAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    await expect(createPlace(makeFormData())).rejects.toThrow("Unauthorized");
  });

  it("does NOT touch the database when signed out", async () => {
    mockAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    try {
      await createPlace(makeFormData());
    } catch {}

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});

describe("5.5 Server Security — updatePlace", () => {
  it("throws Unauthorized when signed out", async () => {
    mockAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    await expect(updatePlace(PLACE_ID, makeFormData())).rejects.toThrow("Unauthorized");
  });

  it("does NOT query or update the database when signed out", async () => {
    mockAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    try {
      await updatePlace(PLACE_ID, makeFormData());
    } catch {}

    expect(mockDb.select).not.toHaveBeenCalled();
    expect(mockDb.update).not.toHaveBeenCalled();
  });

  it("throws Unauthorized when editing another user's place", async () => {
    mockAuth.mockResolvedValue({ userId: OTHER_ID } as Awaited<ReturnType<typeof auth>>);

    const selectChain = {
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [{ id: PLACE_ID, userId: OWNER_ID, name: "Existing", rating: 3 }]),
        })),
      })),
    };
    mockDb.select.mockReturnValue(selectChain as any);

    await expect(updatePlace(PLACE_ID, makeFormData())).rejects.toThrow("Unauthorized");
  });

  it("does NOT run the update query when editing another user's place", async () => {
    mockAuth.mockResolvedValue({ userId: OTHER_ID } as Awaited<ReturnType<typeof auth>>);

    const selectChain = {
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [{ id: PLACE_ID, userId: OWNER_ID, name: "Existing", rating: 3 }]),
        })),
      })),
    };
    mockDb.select.mockReturnValue(selectChain as any);

    try {
      await updatePlace(PLACE_ID, makeFormData());
    } catch {}

    expect(mockDb.update).not.toHaveBeenCalled();
  });
});

describe("5.5 Server Security — deletePlace", () => {
  it("throws Unauthorized when signed out", async () => {
    mockAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    await expect(deletePlace(PLACE_ID)).rejects.toThrow("Unauthorized");
  });

  it("does NOT query or delete from the database when signed out", async () => {
    mockAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    try {
      await deletePlace(PLACE_ID);
    } catch {}

    expect(mockDb.select).not.toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("throws Unauthorized when deleting another user's place", async () => {
    mockAuth.mockResolvedValue({ userId: OTHER_ID } as Awaited<ReturnType<typeof auth>>);

    const selectChain = {
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [{ id: PLACE_ID, userId: OWNER_ID, name: "Existing", rating: 3 }]),
        })),
      })),
    };
    mockDb.select.mockReturnValue(selectChain as any);

    await expect(deletePlace(PLACE_ID)).rejects.toThrow("Unauthorized");
  });

  it("does NOT run the delete query when deleting another user's place", async () => {
    mockAuth.mockResolvedValue({ userId: OTHER_ID } as Awaited<ReturnType<typeof auth>>);

    const selectChain = {
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [{ id: PLACE_ID, userId: OWNER_ID, name: "Existing", rating: 3 }]),
        })),
      })),
    };
    mockDb.select.mockReturnValue(selectChain as any);

    try {
      await deletePlace(PLACE_ID);
    } catch {}

    expect(mockDb.delete).not.toHaveBeenCalled();
  });
});
