import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  doublePrecision,
  date,
  index,
} from "drizzle-orm/pg-core";

export const places = pgTable(
  "places",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id").notNull(),

    name: text("name").notNull(),
    rating: integer("rating").notNull(),

    note: text("note"),

    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    address: text("address"),

    visitedDate: date("visited_date"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("places_user_id_idx").on(table.userId),
  }),
);
