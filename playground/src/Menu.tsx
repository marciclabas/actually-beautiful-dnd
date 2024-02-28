import Single from "./pages/single/App"
import { RouteObject, useNavigate, useRoutes } from "react-router-dom"
import { Button } from "@chakra-ui/react"
import Multi from "./pages/multi/Multi"
import TouchAnim from "./pages/touch/TouchAnim"

const pages: Record<string, JSX.Element> = {
  single: <Single />,
  multi: <Multi />,
  touch: <TouchAnim />
}

function Menu() {
  const goto = useNavigate()
  const menu = (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{display: 'flex', height: 'max-content', flexDirection: 'column', gap: '0.2rem' }}>
        {Object.entries(pages).map(([page], i) => (
          <Button style={{ fontSize: '1rem', padding: '0.5rem', cursor: 'pointer' }} key={i} onClick={() => goto(page)}>{page}</Button>
        ))}
      </div>
    </div>
  )

  const routes: RouteObject[] = Object.entries(pages).map(([page, element]) => ({
    path: page, element
  }))

  return useRoutes([...routes, { path: '*', element: menu }])
}

export default Menu
