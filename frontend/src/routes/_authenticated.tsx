import { userQueryOptions } from "@/lib/api"
import { createFileRoute, Outlet } from "@tanstack/react-router"

const Login = () => {
  return (
    <div>
      Login
      <a href="/api/login">Click to login!</a>
    </div>
  )
}

const Component = () => {
  const { user } = Route.useRouteContext()

  if (!user) {
    return <Login />
  }

  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (error) {
      console.error(error)
      return { user: null }
    }

  },
  component: Component
})