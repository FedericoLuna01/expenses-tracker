import { getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from '@/lib/api'
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
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: ExpensesPage,
})

function ExpensesPage() {
  const { isPending, error, data } = useQuery(getAllExpensesQueryOptions)
  const { data: loadingCreateExpense } = useQuery(loadingCreateExpenseQueryOptions)

  if (error) return <p>Error: {error.message}</p>

  return (
    <main className="">
      <div className="max-w-3xl mx-auto mt-10">
        <Table className="w-full">
          <TableCaption>A list of your recent expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Expense</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              loadingCreateExpense?.expense && (
                <TableRow>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4" />
                  </TableCell>
                </TableRow>
              )
            }
            {isPending
              ? Array(3)
                .fill(null)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4" />
                    </TableCell>
                  </TableRow>
                ))
              : data?.expenses.map(({ amount, id, title, date }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{title}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>
                    <DeleteExpenseButton id={id} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}

function DeleteExpenseButton({ id }: { id: number }) {
  return (
    <Button
      size="icon"
      variant="destructive"
    >
      <Trash className='size-5' />
    </Button>
  )
}