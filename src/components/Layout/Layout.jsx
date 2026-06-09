import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

export default function Layout() {
  const { toasts } = useApp();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
