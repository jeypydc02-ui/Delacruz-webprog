import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

// Public layout
import Layout from './components/Layout';
import ArticleListPage from './pages/ArticleListPage';
import ArticlePage from './pages/ArticlePage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

// Auth layout
import AuthLayout from './layouts/AuthLayout';
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

// Dashboard layout
import DashLayout from './layouts/DashLayout';
import DashboardPage from './pages/DashboardPages/DashboardPage';
import ReportsPage from './pages/DashboardPages/ReportsPage';
import UsersPage from './pages/DashboardPages/UsersPage';
import DashArticleListPage from './pages/DashboardPages/DashArticleListPage';

import RequireRole from './components/RequireRole';
import NotFoundPage from './pages/NotFoundPage';

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '',               element: <Navigate to="/home" replace /> },
      { path: 'home',           element: <HomePage /> },
      { path: 'about',          element: <AboutPage /> },
      { path: 'articles',       element: <ArticleListPage /> },
      { path: 'articles/:name', element: <ArticlePage /> },
    ],
  },
  {
    path: 'auth/',
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
  {
    path: 'dashboard/',
    element: (
      <RequireRole allow={['admin', 'editor']}>
        <DashLayout />
      </RequireRole>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { path: '',         element: <DashboardPage /> },
      { path: 'articles', element: (
          <RequireRole allow={['admin', 'editor']}>
            <DashArticleListPage />
          </RequireRole>
        ),
      },
      { path: 'reports',  element: <ReportsPage /> },
      { path: 'users',    element: (
          <RequireRole allow={['admin']}>
            <UsersPage />
          </RequireRole>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
