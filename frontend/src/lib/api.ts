import { type ApiRoutes } from "@server/index.ts";
import { type CreateExpense } from "@server/sharedTypes";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/")

export const api = client.api

async function getCurrentUser() {
  const res = await api.me.$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser, staleTime: Infinity
})

export async function getAllExpenses() {
  const res = await api.expenses.$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ['get-all-expenses'],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5, // 5 minutes
});

export async function createExpense(value: CreateExpense) {
  const res = await api.expenses.$post({ json: value })
  if (!res.ok) {
    throw new Error('Server error')
  }

  const newExpense = await res.json()

  return newExpense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{ expense?: CreateExpense }>({
  queryKey: ['create-expense'],
  queryFn: async () => {
    return {}
  },
  enabled: false,
})