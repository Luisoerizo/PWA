import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

const OrderDetails: React.FC<{ order: Order }> = ({ order }) => (
  <div className="p-4 bg-pink-50/30 space-y-2 backdrop-blur-sm">
    <h4 className="font-semibold text-md text-gray-800">Items Purchased:</h4>
    <ul className="divide-y divide-gray-200/50">
      {order.items.map(item => (
        <li key={item.id} className="py-2 flex justify-between text-sm">
          <span className="text-gray-600">{item.name} x {item.quantity}</span>
          <span className="text-gray-800">${(item.salePrice * item.quantity).toFixed(2)}</span>
        </li>
      ))}
    </ul>
     <div className="border-t pt-2 mt-2 border-gray-200/50 space-y-1">
        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm font-bold text-gray-900"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
         <div className="flex justify-between text-sm text-gray-600"><span>Amount Paid</span><span>${order.amountPaid.toFixed(2)}</span></div>
         <div className="flex justify-between text-sm text-blue-600"><span>Change</span><span>${order.change.toFixed(2)}</span></div>
     </div>
  </div>
);

const OrderRow: React.FC<{ order: Order }> = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr onClick={() => setIsOpen(!isOpen)} className="cursor-pointer hover:bg-white/50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleString()}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.length}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${order.total.toFixed(2)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <svg className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={5}>
            <OrderDetails order={order} />
          </td>
        </tr>
      )}
    </>
  );
};


const OrderHistoryView: React.FC = () => {
  const { orders } = useAppContext();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-10 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg">
          <p className="text-gray-500">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-pink-50/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-gray-200/50">
              {orders.map(order => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryView;