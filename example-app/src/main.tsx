import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HookSimpleForm from './pages/HookSimpleForm/HookSimpleForm';
import HookDoubleForm from './pages/HookDoubleForm/HookDoubleForm';
import HookDynamicForm from './pages/HookDynamicForm/HookDynamicForm';
import HookFieldsForm from './pages/HookFieldsForm/HookFieldsForm';
import HookLibForm from './pages/HookLibForm/HookLibForm';
import ComponentSimpleForm from './pages/ComponentSimpleForm/ComponentSimpleForm';
import ComponentDoubleForm from './pages/ComponentDoubleForm/ComponentDoubleForm';
import ComponentDynamicForm from './pages/ComponentDynamicForm/ComponentDynamicForm';
import ComponentFieldsForm from './pages/ComponentFieldsForm/ComponentFieldsForm';
import ComponentLibForm from './pages/ComponentLibForm/ComponentLibForm';
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
    path: '/hook-fields',
    element: (
      <Layout>
        <HookFieldsForm />
      </Layout>
    ),
  },
  {
    path: '/hook-lib',
    element: (
      <Layout>
        <HookLibForm />
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
  {
    path: '/component-fields',
    element: (
      <Layout>
        <ComponentFieldsForm />
      </Layout>
    ),
  },
  {
    path: '/component-lib',
    element: (
      <Layout>
        <ComponentLibForm />
      </Layout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
