import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-form-adapter'

import { useForm } from '@tanstack/react-form'
import { createExpense, getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { createExpenseSchema } from '@server/sharedTypes'
import { Calendar } from '@/components/ui/calendar'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: "0",
      date: (new Date()).toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(getAllExpensesQueryOptions)

      navigate({ to: '/expenses' })

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
        expense: value
      })

      try {
        const newExpense = await createExpense(value)

        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, ({
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses]
        }))
      } catch (error) {
        console.log(error)
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {})
      }

    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: createExpenseSchema,
    }
  })

  return (
    <div>
      <Card className="max-w-2xl mx-auto mt-4">
        <CardHeader>
          <CardTitle>Create expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <div>
              <form.Field
                name="title"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Title</Label>
                      <Input
                        id={field.name}
                        placeholder="Some expense"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length ? (
                        <em>{field.state.meta.errors.join(', ')}</em>
                      ) : null}
                    </>
                  )
                }}
              />
            </div>
            <div>
              <form.Field
                name="amount"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Amount</Label>
                      <Input
                        id={field.name}
                        placeholder="1000"
                        type="number"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value)
                        }
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length ? (
                        <em>{field.state.meta.errors.join(', ')}</em>
                      ) : null}
                    </>
                  )
                }}
              />
            </div>
            <div>
              <form.Field
                name="date"
                children={(field) => {
                  return (
                    <div>
                      <Calendar
                        mode="single"
                        selected={new Date(field.state.value)}
                        onSelect={(date) => field.handleChange((date ?? new Date()).toISOString())}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </div>
                  )
                }}
              />
            </div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button disabled={!canSubmit}>
                  {isSubmitting ? '...' : 'Submit'}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
