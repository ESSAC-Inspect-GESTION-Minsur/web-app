import React, { type ReactElement } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/shared/config/router'

import 'react-toastify/dist/ReactToastify.css'

function App (): ReactElement {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
