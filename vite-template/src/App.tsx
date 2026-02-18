import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { AuthProvider } from './contexts/AuthContext'
import { ContentProvider } from './contexts/ContentContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
