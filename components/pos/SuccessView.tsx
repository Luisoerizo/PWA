import React from 'react';

interface SuccessViewProps {
  change: number;
  onPrint: () => void;
  onNewOrder: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ change, onPrint, onNewOrder }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <div className="bg-green-100 rounded-full p-6 mb-6 animate-bounce-in">
        <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in-delay">¡Venta Registrada!</h2>
      <p className="text-lg text-gray-600 mb-4 animate-fade-in-delay2">Cambio devuelto: <span className="font-bold">${change.toFixed(2)}</span></p>
      <div className="flex gap-4 mt-4 animate-fade-in-delay3">
        <button onClick={onPrint} className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors">Imprimir Ticket</button>
        <button onClick={onNewOrder} className="px-6 py-3 bg-pink-500 text-white rounded-md font-semibold hover:bg-pink-600 transition-colors">Nuevo Pedido</button>
      </div>
    </div>
  );
};

export default SuccessView;
