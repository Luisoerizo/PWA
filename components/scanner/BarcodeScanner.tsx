import React, { useEffect, useRef } from 'react';
import { Html5Qrcode, QrCodeSuccessCallback, QrCodeErrorCallback } from 'html5-qrcode';
import Modal from '../ui/Modal';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onStop: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onStop }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = "barcode-reader";

  useEffect(() => {
    // Prevent multiple initializations
    if (scannerRef.current) {
        return;
    }

    const html5Qrcode = new Html5Qrcode(readerElementId);
    scannerRef.current = html5Qrcode;

    const qrCodeSuccessCallback: QrCodeSuccessCallback = (decodedText, decodedResult) => {
        onScanSuccess(decodedText);
        html5Qrcode.stop().catch(err => console.error("Failed to stop scanner after success", err));
    };

    const qrCodeErrorCallback: QrCodeErrorCallback = (errorMessage) => {
        // parse error, ignore it.
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    Html5Qrcode.getCameras().then(cameras => {
        if (cameras && cameras.length) {
            // Prefer back camera by looking for "back" in the label
            const cameraId = cameras.find(c => c.label.toLowerCase().includes('back'))?.id || cameras[0].id;
            html5Qrcode.start(
                cameraId,
                config,
                qrCodeSuccessCallback,
                qrCodeErrorCallback
            ).catch(err => {
                console.error("Unable to start scanning with specified camera.", err);
                alert(`Error starting camera: ${err.message}`);
                onStop();
            });
        } else {
            // Fallback for devices that might not list cameras until permission is given
             html5Qrcode.start(
                { facingMode: "environment" },
                config,
                qrCodeSuccessCallback,
                qrCodeErrorCallback
            ).catch(err => {
                console.error("Unable to start scanning with facingMode.", err);
                alert(`Error accessing camera: ${err.message}. Please ensure permissions are granted.`);
                onStop();
            });
        }
    }).catch(err => {
        console.error("Error getting camera list.", err);
        alert("Could not get camera list. Please ensure permissions are granted and refresh the page.");
        onStop();
    });

    return () => {
      if (scannerRef.current) {
        // Checking state before stopping is good practice
        scannerRef.current.getState() === "SCANNING" &&
        scannerRef.current.stop().catch(err => {
            if (String(err).includes("not running")) {
                console.log("Scanner was already stopped.");
            } else {
                 console.error("Error stopping scanner on cleanup", err);
            }
        });
      }
    };
  }, [onScanSuccess, onStop]);

  return (
    <Modal isOpen={true} onClose={onStop} title="Scan Barcode" size="lg">
      <div id={readerElementId} style={{ width: '100%' }}></div>
      <p className="text-center mt-4 text-gray-500">Point your camera at a barcode.</p>
    </Modal>
  );
};

export default BarcodeScanner;