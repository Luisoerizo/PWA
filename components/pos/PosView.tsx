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
      className={`relative rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${isOutOfStock ? 'bg-gray-300/70' : 'bg-white/50 backdrop-blur-md'}
        sm:w-64 w-full mx-auto my-2 animate-fade-in-up`}
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
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white/60 backdrop-blur-md rounded-b-lg flex flex-col gap-1" style={{backdropFilter: 'blur(8px)'}}>
        <h3 className="font-semibold text-md text-gray-800 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</p>
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

const PosView: React.FC = () => {
  const { products, addToCart } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  // const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

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
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">


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
            {/*
            <div className="flex gap-2">
              <button onClick={() => setShowBarcodeScanner(true)} className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                <BarcodeIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Scan Barcode</span>
              </button>
            </div>
            */}
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
          <CartView />
        </div>
      </div>
    </>
  );
};

export default PosView;