import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, Keyboard } from 'lucide-react';

export default function BarcodeScanner({ onScan, onClose }) {
  const [mode, setMode] = useState('camera'); // 'camera' or 'manual'
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const scannerDivId = 'barcode-scanner-region';

  useEffect(() => {
    if (mode === 'camera') {
      startScanner();
    }
    return () => stopScanner();
  }, [mode]);

  const startScanner = async () => {
    try {
      setError('');
      setScanning(true);
      const scanner = new Html5Qrcode(scannerDivId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {} // ignore errors during scanning
      );
    } catch (err) {
      setError('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้กล้อง หรือใช้โหมดพิมพ์บาร์โค้ด');
      setScanning(false);
      setMode('manual');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) { // SCANNING state
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (e) {
        // ignore cleanup errors
      }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (code) => {
    await stopScanner();
    onScan(code);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Camera size={20} />
          สแกนบาร์โค้ด
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${mode === 'camera' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setMode('camera')}
          >
            <Camera size={16} />
            กล้อง
          </button>
          <button
            className={`btn btn-sm ${mode === 'manual' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { stopScanner(); setMode('manual'); }}
          >
            <Keyboard size={16} />
            พิมพ์
          </button>
          {onClose && (
            <button className="btn btn-sm btn-ghost" onClick={onClose}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="card-body">
        {mode === 'camera' ? (
          <div>
            <div
              id={scannerDivId}
              className="scanner-container"
              style={{ minHeight: '300px', borderRadius: 'var(--radius-lg)' }}
            />
            {error && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px', 
                background: 'var(--color-danger-50)', 
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger-600)',
                fontSize: '13px'
              }}>
                {error}
              </div>
            )}
            <p style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginTop: '12px', textAlign: 'center' }}>
              ส่องกล้องไปที่บาร์โค้ดของสินค้า
            </p>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit}>
            <div className="form-group">
              <label className="form-label">พิมพ์หรือสแกนบาร์โค้ด</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="พิมพ์เลขบาร์โค้ด หรือใช้เครื่องสแกน USB..."
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">
                  ค้นหา
                </button>
              </div>
              <p className="form-help">
                รองรับเครื่องสแกนบาร์โค้ดแบบ USB — เสียบแล้วสแกนได้เลย
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
