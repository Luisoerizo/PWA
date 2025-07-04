import React, { useState } from 'react';
import Notification, { NotificationType } from '../ui/Notification';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';
import CartView from './CartView';
import { BarcodeIcon, AiIcon } from '../ui/Icons';
import BarcodeScanner from '../scanner/BarcodeScanner';
import AiScanner from '../scanner/AiScanner';

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= product.lowStockThreshold;

  return (
    <div className={`relative rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 ${isOutOfStock ? 'bg-gray-300/70' : 'bg-white/70 backdrop-blur-sm'}`}>
      <img src={product.imageUrl} alt={product.name} className={`w-full h-40 object-cover ${isOutOfStock ? 'opacity-50' : ''}`} />
      {isLowStock && <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">Low Stock</span>}
      {isOutOfStock && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Out of Stock</span>}

      <div className="p-4">
        <h3 className="font-semibold text-md text-gray-800 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.sku}</p>
        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="px-3 py-1 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const PosView: React.FC = () => {
  const { products, addToCart } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showAiScanner, setShowAiScanner] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBarcodeScanned = (sku: string) => {
    const product = products.find(p => p.sku === sku);
    if (product) {
      addToCart(product);
      setNotification({ message: `Agregado: ${product.name}`, type: 'success' });
    } else {
      setNotification({ message: `Producto con SKU ${sku} no encontrado.`, type: 'error' });
    }
    setShowBarcodeScanner(false);
  };

  const handleAiProductIdentified = (sku: string) => {
    const product = products.find(p => p.sku === sku);
    if(product) {
      addToCart(product);
      setNotification({ message: `AI identificó y agregó: ${product.name}`, type: 'success' });
    } else {
      setNotification({ message: `AI identificó SKU ${sku}, pero no está en inventario.`, type: 'error' });
    }
    setShowAiScanner(false);
  };

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
        {showBarcodeScanner && <BarcodeScanner onScanSuccess={handleBarcodeScanned} onStop={() => setShowBarcodeScanner(false)} />}
        {showAiScanner && <AiScanner onIdentified={handleAiProductIdentified} onStop={() => setShowAiScanner(false)} />}

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
            <div className="flex gap-2">
              <button onClick={() => setShowBarcodeScanner(true)} className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                <BarcodeIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Scan Barcode</span>
              </button>
              <button onClick={() => setShowAiScanner(true)} className="flex-1 flex items-center justify-center gap-2 p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                <AiIcon className="h-5 w-5" />
                <span className="hidden sm:inline">AI Identify</span>
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={(p) => {
                  addToCart(p);
                  setNotification({ message: `Agregado: ${p.name}`, type: 'success' });
                }} />
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