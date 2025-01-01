import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/expenses')({
  component: ExpensesPage,
})

async function getExpenses() {
  const res = await api.expenses.$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

function ExpensesPage() {
  const { isPending, error, data } = useQuery({ queryKey: ['get-expenses'], queryFn: getExpenses })

  if (error) return <p>Error: {error.message}</p>

  return (
    <main className='min-h-screen flex items-center justify-center'>
      {
        isPending ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {data.expenses.map((expense) => (
              <li key={expense.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{expense.title}</CardTitle>
                    <CardDescription>
                      {expense.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {`$${expense.amount}`}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )
      }
    </main>
  )
}