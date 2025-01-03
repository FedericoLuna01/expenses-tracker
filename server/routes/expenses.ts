import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from '@hono/zod-validator'
import { getUser } from "../kinde.js"

import { db } from "../db/index.js"
import { expenses as expensesTable } from "../db/schema/expenses.js"
import { eq } from "drizzle-orm"

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  // amount: z.number().int().positive(),
  amount: z.string(),
})

const createPostSchema = expenseSchema.omit({ id: true })

type Expense = z.infer<typeof expenseSchema>

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Coffee",
    amount: "2",
  },
  {
    id: 2,
    title: "Lunch",
    amount: "10",
  },
  {
    id: 3,
    title: "Dinner",
    amount: "20",
  }
]

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))

    return c.json({ expenses })
  })
  .post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    const expense = c.req.valid("json")
    const user = c.var.user;

    const res = await db.insert(expensesTable).values({
      ...expense,
      userId: user.id
    }).returning()

    return c.json(res)
  })
  .get("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const expense = fakeExpenses.find((e) => e.id === id)
    if (!expense) {
      return c.notFound()
    }
    return c.json({ expense })
  })
  .get("/total-spent", getUser, async (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + Number(e.amount), 0)
    return c.json({ total })
  })
  .delete("/:id{[0-9]+}", getUser, (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const index = fakeExpenses.findIndex((e) => e.id === id)
    if (index === -1) {
      return c.notFound()
    }
    const deletedExpense = fakeExpenses.splice(index, 1)[0]
    return c.json({ expense: deletedExpense })
  })
// .put()