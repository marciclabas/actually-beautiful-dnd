import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter([{
  path: '*',
  element: <App />
}])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
)
