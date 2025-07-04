import React, { useRef, useState, useEffect, useCallback } from 'react';
import Modal from '../ui/Modal';
import { identifyProductFromImage } from '../../services/geminiService';
import { useAppContext } from '../../context/AppContext';
import { CameraIcon } from '../ui/Icons';

interface AiScannerProps {
  onIdentified: (sku: string) => void;
  onStop: () => void;
}

const AiScanner: React.FC<AiScannerProps> = ({ onIdentified, onStop }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { products } = useAppContext();
  
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported on this browser.");
        return;
    }

    let stream: MediaStream;
    try {
        // First, try to get the back camera
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    } catch (err) {
        console.warn("Could not get environment camera, trying default.", err);
        try {
            // If that fails, try to get any camera
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (finalErr) {
            console.error("Error accessing camera: ", finalErr);
            const errMsg = finalErr instanceof Error ? finalErr.message : String(finalErr);
            setError(`Could not access the camera. Please check permissions. Error: ${errMsg}`);
            return;
        }
    }

    if (videoRef.current) {
        videoRef.current.srcObject = stream;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoading(true);
    setError(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
      const sku = await identifyProductFromImage(base64Image, products);
      if (sku) {
        onIdentified(sku);
      } else {
        setError("Could not identify the product from the image. Please try again.");
      }
    } catch (e: any) {
      setError(e.message || "An unknown error occurred during AI analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onStop} title="Identify Product with AI" size="xl">
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg"></video>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="text-white mt-4">Analyzing image...</p>
          </div>
        )}

      </div>
      <div className="mt-4 text-center">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button 
          onClick={captureImage} 
          disabled={isLoading || !!error}
          className="w-1/2 mx-auto py-3 px-4 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <CameraIcon className="h-6 w-6"/>
          Capture & Identify
        </button>
      </div>
    </Modal>
  );
};

export default AiScanner;