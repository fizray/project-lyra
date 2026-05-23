import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PlaceCard } from "@/components/places/place-card";
import { RatingDisplay, clampRating } from "@/components/places/rating-display";
import { normalizePlaceSort } from "@/lib/queries/places";

const basePlace = {
  id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  userId: "user_owner",
  name: "Cafe Lyra",
  rating: 4,
  note: "Small corner cafe with reliable coffee and calm tables.",
  latitude: null,
  longitude: null,
  address: "Bandung",
  visitedDate: "2026-05-20",
  createdAt: new Date("2026-05-21T00:00:00.000Z"),
  updatedAt: new Date("2026-05-21T00:00:00.000Z"),
};

describe("Phase 7 — RatingDisplay", () => {
  it("renders a 1-5 star rating with text", () => {
    const html = renderToStaticMarkup(<RatingDisplay rating={4} />);

    expect(html).toContain("★★★★☆");
    expect(html).toContain("4/5");
  });

  it("clamps invalid ratings into the 1-5 display range", () => {
    expect(clampRating(0)).toBe(1);
    expect(clampRating(6)).toBe(5);
  });
});

describe("Phase 6 — place sorting", () => {
  it("defaults to newest sort", () => {
    expect(normalizePlaceSort(undefined)).toBe("newest");
    expect(normalizePlaceSort("unknown")).toBe("newest");
  });

  it("supports rating sort", () => {
    expect(normalizePlaceSort("rating")).toBe("rating");
    expect(normalizePlaceSort(["rating", "newest"])).toBe("rating");
  });
});

describe("Phase 7 — PlaceCard actions", () => {
  it("shows owner edit and delete actions", () => {
    const html = renderToStaticMarkup(<PlaceCard place={basePlace} currentUserId="user_owner" />);

    expect(html).toContain("Edit");
    expect(html).toContain("Delete");
  });

  it("hides owner actions when viewer is signed out or not owner", () => {
    const signedOutHtml = renderToStaticMarkup(
      <PlaceCard place={basePlace} currentUserId={null} />,
    );
    const otherUserHtml = renderToStaticMarkup(
      <PlaceCard place={basePlace} currentUserId="user_other" />,
    );

    expect(signedOutHtml).not.toContain("Edit");
    expect(signedOutHtml).not.toContain("Delete");
    expect(otherUserHtml).not.toContain("Edit");
    expect(otherUserHtml).not.toContain("Delete");
  });
});
