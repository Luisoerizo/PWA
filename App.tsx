
import React, { useState } from 'react';

import Layout from './components/Layout';
import PosView from './components/pos/PosView';
import CheckoutModal from './components/pos/CheckoutModal';
import SuccessView from './components/pos/SuccessView';
import InventoryView from './components/inventory/InventoryView';
import OrderHistoryView from './components/orders/OrderHistoryView';


type MainView = 'main' | 'checkout' | 'success' | 'inventory' | 'orders';

const App: React.FC = () => {
  const [view, setView] = useState<MainView>('main');
  const [change, setChange] = useState(0);

  return (
    <Layout currentView={view} setCurrentView={setView}>
      {view === 'main' && (
        <PosView onCheckout={() => setView('checkout')} />
      )}
      {view === 'checkout' && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setView('main')}
          onSuccess={(changeValue: number) => {
            setChange(changeValue);
            setView('success');
          }}
        />
      )}
      {view === 'success' && (
        <SuccessView
          change={change}
          onPrint={() => window.print()}
          onNewOrder={() => setView('main')}
        />
      )}
      {view === 'inventory' && <InventoryView />}
      {view === 'orders' && <OrderHistoryView />}
    </Layout>
  );
};

export default App;
