import React, { useState } from 'react';
import Notification, { NotificationType } from '../ui/Notification';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';
import CartView from './CartView';
import { BarcodeIcon } from '../ui/Icons';
// import BarcodeScanner from '../scanner/BarcodeScanner';

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  return (
    <div
      className={[
        'relative rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105',
        isOutOfStock ? 'bg-gray-300/70' : '',
        'sm:w-64 w-full mx-auto',
        isOutOfStock ? 'my-2' : 'my-1',
        'animate-fade-in-up'
      ].join(' ')}
      style={{ minHeight: 280 }}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`w-full h-40 object-cover ${isOutOfStock ? 'opacity-50' : ''}`}
        loading="lazy"
      />
      {isLowStock && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full animate-pulse">
          Pocas unidades
        </span>
      )}
      {isOutOfStock && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full animate-bounce">
          Sin stock
        </span>
      )}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-black/60 rounded-b-lg flex flex-col gap-1" style={{backdropFilter: 'blur(4px)'}}>
        <h3 className="font-semibold text-md text-white truncate">{product.name}</h3>
        <p className="text-gray-200 text-sm">SKU: {product.sku}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-pink-200">${product.price.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="px-3 py-1 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-pink-300 focus:outline-none"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

interface PosViewProps {
  onCheckout: () => void;
}

const PosView: React.FC<PosViewProps> = ({ onCheckout }) => {
  const { products, addToCart, cart } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Botón flotante de carrito en móvil */}
      {isMobile && !drawerOpen && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-pink-500 text-white rounded-full shadow-lg p-4 flex items-center gap-2 animate-bounce-in"
          style={{ boxShadow: '0 4px 24px 0 rgba(249, 168, 212, 0.4)' }}
          onClick={() => setDrawerOpen(true)}
        >
          <span className="font-bold">Carrito</span>
          <span className="bg-white text-pink-500 rounded-full px-2 py-1 text-xs font-bold">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
        </button>
      )}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)] animate-fade-in">
        {/* Product Grid */}
        <div className="lg:w-2/3 flex flex-col">
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md bg-white/50 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-10 gap-y-8 px-2 md:px-4 xl:px-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="flex">
                  <ProductCard product={product} onAddToCart={(p) => {
                    addToCart(p);
                    setNotification({ message: `Agregado: ${p.name}`, type: 'success' });
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Cart View */}
        <div className="lg:w-1/3 flex flex-col bg-white/50 backdrop-blur-md rounded-lg shadow-2xl">
          <CartView onCheckout={onCheckout} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} isMobile={isMobile} />
        </div>
      </div>
    </>
  );
};

export default PosView;