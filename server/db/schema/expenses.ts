import { date, index, integer, numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from "zod";

export const expenses = pgTable("expenses", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(),
  title: text().notNull(),
  amount: numeric({ precision: 12, scale: 2 }).notNull(),
  date: date().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
}, (expenses) => {
  return {
    userIdIndex: index("user_id_index").on(expenses.userId),
  }
});

export const expensesInsertSchema = createInsertSchema(expenses, {
  title: z
    .string()
    .min(3),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be positive"),
});

export const expensesSelectSchema = createSelectSchema(expenses);