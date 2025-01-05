import { expensesInsertSchema } from "./db/schema/expenses.js"
import z from "zod"

export const createExpenseSchema = expensesInsertSchema.omit({
  createdAt: true,
  userId: true,
})

export type CreateExpense = z.infer<typeof createExpenseSchema>