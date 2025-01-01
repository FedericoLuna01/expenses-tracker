import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from '@hono/zod-validator'

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
})

const createPostSchema = expenseSchema.omit({ id: true })

type Expense = z.infer<typeof expenseSchema>

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Coffee",
    amount: 2,
  },
  {
    id: 2,
    title: "Lunch",
    amount: 10,
  },
  {
    id: 3,
    title: "Dinner",
    amount: 20,
  }
]

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    return c.json({ expenses: fakeExpenses })
  })
  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = c.req.valid("json")
    fakeExpenses.push({ id: fakeExpenses.length + 1, ...expense })
    return c.json(expense)
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const expense = fakeExpenses.find((e) => e.id === id)
    if (!expense) {
      return c.notFound()
    }
    return c.json({ expense })
  })
  .get("/total-spent", async (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0)
    return c.json({ total })
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const index = fakeExpenses.findIndex((e) => e.id === id)
    if (index === -1) {
      return c.notFound()
    }
    const deletedExpense = fakeExpenses.splice(index, 1)[0]
    return c.json({ expense: deletedExpense })
  })
// .put()