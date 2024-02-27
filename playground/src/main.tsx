import React from 'react'
import ReactDOM from 'react-dom/client'
import Menu from './Menu.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter([{
  path: '*',
  element: <Menu />
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
)
