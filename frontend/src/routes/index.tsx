import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute('/')({
  component: Index,
})

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

function Index() {
  const { isPending, error, data } = useQuery({ queryKey: ['get-total-spent'], queryFn: getTotalSpent })

  if (error) return <p>Error: {error.message}</p>

  return (
    <main className='min-h-screen flex items-center justify-center'>
      <Card>
        <CardHeader>
          <CardTitle>Total spent</CardTitle>
          <CardDescription>
            This is your total spent
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <p>Loading...</p>
          ) : (
            <p>{data.total}</p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

