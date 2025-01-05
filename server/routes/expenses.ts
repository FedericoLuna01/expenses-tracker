import { Hono } from "hono"
import { zValidator } from '@hono/zod-validator'
import { getUser } from "../kinde.js"

import { db } from "../db/index.js"
import { expenses as expensesTable, expensesInsertSchema } from "../db/schema/expenses.js"
import { and, desc, eq, sum } from "drizzle-orm"
import { createExpenseSchema } from "../sharedTypes.js"

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      // TODO: add pagination
      .limit(100)

    return c.json({ expenses })
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = c.req.valid("json")
    const user = c.var.user;

    const validatedExpense = expensesInsertSchema.parse({
      ...expense,
      userId: user.id
    })

    if (!validatedExpense) {
      return c.json({ error: "Invalid expense" }, 400)
    }

    const res = await db
      .insert(expensesTable)
      .values({
        ...expense,
        userId: user.id
      })
      .returning()
      .then(res => res[0])

    return c.json(res)
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user;

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then(res => res[0])

    if (!expense) {
      return c.notFound()
    }
    return c.json({ expense })
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;

    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then(res => res[0])

    return c.json(result)
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user;

    const expense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()
      .then(res => res[0])

    if (!expense) {
      return c.notFound()
    }

    return c.json({ expense })
  })
// .put()