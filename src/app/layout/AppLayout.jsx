import { Outlet } from 'react-router-dom';
import '@/styles.css';

export default function AppLayout() {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}
