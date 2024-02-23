import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HookSimpleForm from './pages/HookSimpleForm/HookSimpleForm';
import HookDoubleForm from './pages/HookDoubleForm/HookDoubleForm';
import HookDynamicForm from './pages/HookDynamicForm/HookDynamicForm';
import ComponentSimpleForm from './pages/ComponentSimpleForm/ComponentSimpleForm';
import ComponentDoubleForm from './pages/ComponentDoubleForm/ComponentDoubleForm';
import ComponentDynamicForm from './pages/ComponentDynamicForm/ComponentDynamicForm';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <HookSimpleForm />
      </Layout>
    ),
  },
  {
    path: '/hook-double',
    element: (
      <Layout>
        <HookDoubleForm />
      </Layout>
    ),
  },
  {
    path: '/hook-dynamic',
    element: (
      <Layout>
        <HookDynamicForm />
      </Layout>
    ),
  },
  {
    path: '/component-simple',
    element: (
      <Layout>
        <ComponentSimpleForm />
      </Layout>
    ),
  },
  {
    path: '/component-double',
    element: (
      <Layout>
        <ComponentDoubleForm />
      </Layout>
    ),
  },
  {
    path: '/component-dynamic',
    element: (
      <Layout>
        <ComponentDynamicForm />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
