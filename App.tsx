
import React, { useState } from 'react';
import Layout from './components/Layout';
import PosView from './components/pos/PosView';
import InventoryView from './components/inventory/InventoryView';
import OrderHistoryView from './components/orders/OrderHistoryView';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('pos');

  const renderView = () => {
    switch (currentView) {
      case 'inventory':
        return <InventoryView />;
      case 'orders':
        return <OrderHistoryView />;
      case 'pos':
      default:
        return <PosView />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
