import React, { useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import Notification, { NotificationType } from '../ui/Notification';
import { useAppContext } from '../../context/AppContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (change: number) => void;
  subtotal?: number;
  discount?: number;
  total?: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess, subtotal, discount, total }) => {
  const { cart, addOrder, clearCart } = useAppContext();
  const [amountPaid, setAmountPaid] = useState<number | string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  // fallback values for direct usage from App.tsx
  const _subtotal = subtotal ?? cart.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
  const _discount = discount ?? 0;
  const _total = total ?? (_subtotal - _discount);

  const change = useMemo(() => {
    const paid = typeof amountPaid === 'number' ? amountPaid : parseFloat(amountPaid as string);
    if (!isNaN(paid) && paid >= _total) {
      return paid - _total;
    }
    return 0;
  }, [amountPaid, _total]);

  const handleCompleteSale = () => {
    if (typeof amountPaid !== 'number' && parseFloat(amountPaid as string) < _total) {
      setNotification({ message: 'El monto pagado es menor al total.', type: 'error' });
      return;
    }
    addOrder({
      items: cart,
      subtotal: _subtotal,
      discount: _discount,
      total: _total,
      amountPaid: typeof amountPaid === 'number' ? amountPaid : parseFloat(amountPaid as string),
      change
    });
    setNotification({ message: '¡Venta completada con éxito!', type: 'success' });
    setIsCompleted(true);
    if (onSuccess) onSuccess(change);
  };
  
  const handleCloseAndReset = () => {
      setIsCompleted(false);
      setAmountPaid('');
      onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAndReset} title={isCompleted ? "¡Venta completada!" : "Cobrar"}>
      <div className="space-y-4 animate-fade-in">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        {isCompleted ? (
           <div className="text-center p-8 space-y-4">
               <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <h3 className="text-2xl font-bold text-gray-800">¡Gracias por tu compra!</h3>
               <p className="text-lg text-gray-600">Cambio: <span className="font-bold">${change.toFixed(2)}</span></p>
                <button 
                  onClick={() => {
                    clearCart();
                    handleCloseAndReset();
                  }}
                  className="w-full py-3 mt-4 bg-pink-500 text-white rounded-md font-semibold hover:bg-pink-600 transition-colors"
                >
                  Nueva venta
                </button>
           </div>
        ) : (
          <>
            <div className="p-4 border rounded-lg bg-white/30 border-gray-200/50 backdrop-blur-sm space-y-2">
              <h3 className="font-semibold text-lg text-gray-800">Resumen de compra</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.salePrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
                <div className="border-t pt-2 mt-2 border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${_subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-green-600"><span>Descuento</span><span>-${_discount.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg text-gray-900"><span>Total</span><span>${_total.toFixed(2)}</span></div>
                </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">Monto pagado</label>
              <input
                type="number"
                id="amountPaid"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder={_total.toFixed(2)}
                className="w-full p-3 text-2xl border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                autoFocus
              />
            </div>

            <div className="text-right text-lg font-semibold text-gray-800">
              Cambio: <span className="text-blue-600">${change.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={parseFloat(String(amountPaid)) < _total}
              className="w-full py-3 mt-4 bg-pink-500 text-white rounded-md font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Completar venta
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CheckoutModal;