import { expensesInsertSchema } from "./db/schema/expenses.js"

export const createExpenseSchema = expensesInsertSchema.omit({
  createdAt: true,
  userId: true,
})