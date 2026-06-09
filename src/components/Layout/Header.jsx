import { useApp } from '../../context/AppContext';
import { Menu, Bell } from 'lucide-react';

export default function Header({ title, subtitle, actions }) {
  const { toggleSidebar } = useApp();

  return (
    <header className="main-header">
      <div className="main-header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="main-header-right">
        {actions}
      </div>
    </header>
  );
}
