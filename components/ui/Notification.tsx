import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  message: string;
  type?: NotificationType;
  onClose: () => void;
  duration?: number;
}

const typeStyles: Record<NotificationType, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-400 text-gray-900',
  info: 'bg-blue-500 text-white',
};

const Notification: React.FC<NotificationProps> = ({ message, type = 'info', onClose, duration = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-up ${typeStyles[type as NotificationType]}`}
      style={{ minWidth: 220 }}
      role="alert"
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white font-bold" aria-label="Cerrar notificación">×</button>
    </div>
  );
};

export default Notification;
