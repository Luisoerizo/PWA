import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { TrashIcon, EditIcon } from '../ui/Icons';
import CheckoutModal from './CheckoutModal';
import { CartItem } from '../../types';

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateCartItemQuantity, updateCartItemPrice, removeFromCart } = useAppContext();
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(item.salePrice);
  
  const handlePriceUpdate = () => {
    if(!isNaN(newPrice) && newPrice >= 0) {
      updateCartItemPrice(item.id, newPrice);
    }
    setIsEditingPrice(false);
  };
  
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{item.name}</p>
        <div className="flex items-center mt-1 text-sm text-gray-500">
           {isEditingPrice ? (
            <input 
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(parseFloat(e.target.value))}
              onBlur={handlePriceUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handlePriceUpdate()}
              className="w-20 p-1 text-xs bg-white/50 rounded"
              autoFocus
            />
          ) : (
            <>
              <span>${item.salePrice.toFixed(2)}</span>
              <button onClick={() => setIsEditingPrice(true)} className="ml-2 text-pink-500 hover:text-pink-700">
                <EditIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value, 10))}
          className="w-16 p-1 text-center border border-gray-300 rounded-md bg-white/80"
          min="1"
          max={item.stock}
        />
        <p className="w-20 text-right font-semibold">${(item.salePrice * item.quantity).toFixed(2)}</p>
        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const CartView: React.FC = () => {
  const { cart, clearCart } = useAppContext();
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'PERCENT' | 'FLAT'>('FLAT');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.salePrice * item.quantity, 0), [cart]);

  const discountAmount = useMemo(() => {
    if (discountType === 'PERCENT') {
      return (subtotal * discount) / 100;
    }
    return Math.min(subtotal, discount);
  }, [subtotal, discount, discountType]);

  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);
  
  return (
    <div className="h-full flex flex-col p-4 bg-transparent">
      <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2 border-pink-200">Carrito de compras</h2>
      {cart.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Tu carrito está vacío.</p>
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto divide-y divide-gray-200 pr-2">
            {cart.map(item => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-gray-600">Descuento</span>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={discount}
                        onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-24 p-1 border border-gray-300 rounded-md bg-white/80"
                    />
                    <select value={discountType} onChange={(e) => setDiscountType(e.target.value as 'PERCENT' | 'FLAT')} className="p-1 border border-gray-300 rounded-md bg-white/80">
                        <option value="FLAT">$</option>
                        <option value="PERCENT">%</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Descuento</span>
              <span className="text-green-600">-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2 pt-2">
                <button
                    onClick={clearCart}
                    className="w-full py-3 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600 transition-colors"
                    disabled={cart.length === 0}
                >
                    Vaciar carrito
                </button>
                <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3 bg-pink-500 text-white rounded-md font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={cart.length === 0 || total <= 0}
                >
                    Cobrar
                </button>
            </div>
          </div>
        </>
      )}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        subtotal={subtotal}
        discount={discountAmount}
        total={total}
        // No limpiar el carrito aquí, solo cerrar el modal
      />
    </div>
  );
};

export default CartView;