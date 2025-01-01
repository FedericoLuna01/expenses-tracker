import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/expenses')({
  component: ExpensesPage,
})

async function getAllExpenses() {
  await new Promise((r) => setTimeout(r, 2000))
  const res = await api.expenses.$get()
  if (!res.ok) {
    throw new Error('Server error')
  }
  const data = await res.json()
  return data
}

function ExpensesPage() {
  const { isPending, error, data } = useQuery({ queryKey: ['get-all-expenses'], queryFn: getAllExpenses })

  if (error) return <p>Error: {error.message}</p>

  return (
    <main className=''>
      <div className='max-w-3xl mx-auto mt-10'>
        <Table className='w-full'>
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Expense</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              isPending ? Array(3).fill(null).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4" /></TableCell>
                  <TableCell><Skeleton className="h-4" /></TableCell>
                </TableRow>
              )) :
                data?.expenses.map(({ amount, id, title }) => (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{title}</TableCell>
                    <TableCell>{amount}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}