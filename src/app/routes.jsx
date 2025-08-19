import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import InvoicesPage from '@/features/invoices/pages/InvoicesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [{ index: true, element: <InvoicesPage /> }],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
