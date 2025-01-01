import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useForm } from '@tanstack/react-form'
import { api } from "@/lib/api"

export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 2000))

      const res = await api.expenses.$post({ json: value })
      if (!res.ok) {
        throw new Error('Server error')
      }

      navigate({ to: '/expenses' })
    },
  })

  return (
    <div>
      <Card className='max-w-2xl mx-auto mt-4'>
        <CardHeader>
          <CardTitle>
            Create expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className='space-y-4'
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
                        placeholder='Some expense'
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <em>{field.state.meta.errors.join(", ")}</em>
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
                      <Label htmlFor={field.name}>Title</Label>
                      <Input
                        id={field.name}
                        placeholder='1000'
                        type='number'
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length ? (
                        <em>{field.state.meta.errors.join(", ")}</em>
                      ) : null}
                    </>
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
