import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return <p>Loading...</p>

  if (error) return <p>Error: {error.message}</p>

  return <div>
    <p>
      Hello {data.user.given_name}
    </p>
    <a href="/api/logout">Logout</a>
  </div>
}
