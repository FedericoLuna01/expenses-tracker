import { index, integer, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const expenses = pgTable("expenses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  title: text("user_id").notNull(),
  amount: numeric({ precision: 12, scale: 2 }).notNull(),
}, (expenses) => {
  return {
    userIdIndex: index("user_id_index").on(expenses.userId),
  }
});
