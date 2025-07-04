import React from 'react';
import { View } from '../types';
import { PosIcon, InventoryIcon, OrdersIcon } from './ui/Icons';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  view: View;
  currentView: View;
  setCurrentView: (view: View) => void;
  icon: React.ReactNode;
}> = ({ label, view, currentView, setCurrentView, icon }) => {
  const isActive = currentView === view;
  const baseClasses = 'flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150';
  const activeClasses = 'bg-pink-50 text-pink-600';
  const inactiveClasses = 'text-gray-500 hover:bg-pink-50 hover:text-pink-600';

  return (
    <button onClick={() => setCurrentView(view)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  // Solo mostrar navegación en main, inventory y orders
  const showNav = currentView === 'main' || currentView === 'inventory' || currentView === 'orders';
  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <nav className="bg-white shadow-md border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-pink-500 font-bold text-xl">Boutique POS</h1>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <NavItem
                  label="Venta"
                  view="main"
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                  icon={<PosIcon className="h-6 w-6" />}
                />
                <NavItem
                  label="Inventario"
                  view="inventory"
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                  icon={<InventoryIcon className="h-6 w-6" />}
                />
                <NavItem
                  label="Pedidos"
                  view="orders"
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                  icon={<OrdersIcon className="h-6 w-6" />}
                />
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;