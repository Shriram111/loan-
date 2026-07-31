import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { verificationService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';

export default function SelfieVerificationPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [step, setStep] = useState('consent');
  const [capturedImage, setCapturedImage] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert('Camera access is required for selfie verification');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const img = canvas.toDataURL('image/jpeg');
    setCapturedImage(img);
    stopCamera();
    setStep('preview');
  };

  const retake = () => {
    setCapturedImage(null);
    setStep('camera');
    startCamera();
  };

  const handleVerify = async () => {
    if (!selectedApp) return;
    setVerifying(true);
    try {
      const { data } = await verificationService.verifySelfie({ applicationId: selectedApp });
      setResult(data.data);
      setStep('result');
    } catch (err) { console.error(err); } finally { setVerifying(false); }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Selfie Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Capture and verify your identity through live selfie</p>
      </div>

      {step === 'consent' && (
        <div className="card">
          <label className="label">Select Application</label>
          <div className="flex gap-3 mb-6">
            <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="input-field flex-1">
              <option value="">Choose an application...</option>
              {applications.map((app) => (
                <option key={app._id} value={app._id}>{app.applicationId} - {app.personalDetails?.fullName}</option>
              ))}
            </select>
          </div>
          <div className="text-center py-6">
            <Camera className="w-16 h-16 text-primary-pink mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Selfie Capture Consent</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-4">
              Your selfie will be used for identity verification only. It will not be stored permanently.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 max-w-sm mx-auto text-left mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Instructions:</p>
              <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                <li>Keep your face inside the frame</li>
                <li>Ensure proper lighting</li>
                <li>Remove sunglasses or face coverings</li>
                <li>Look directly at the camera</li>
                <li>Follow on-screen instructions</li>
              </ol>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setStep('camera'); setTimeout(startCamera, 100); }} className="btn-primary" disabled={!selectedApp}>
                I Consent - Start Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'camera' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center">
          <div className="relative inline-block rounded-2xl overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-md rounded-2xl" />
            <div className="absolute inset-0 border-4 border-primary-pink/50 rounded-2xl pointer-events-none" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-4 flex gap-3 justify-center">
            <button onClick={() => { stopCamera(); setStep('consent'); }} className="btn-secondary">Cancel</button>
            <button onClick={capturePhoto} className="btn-primary flex items-center gap-2">
              <Camera className="w-4 h-4" /> Capture
            </button>
          </div>
        </motion.div>
      )}

      {step === 'preview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center">
          {capturedImage && (
            <img src={capturedImage} alt="Captured selfie" className="w-full max-w-md rounded-2xl mx-auto" />
          )}
          <div className="mt-4 flex gap-3 justify-center">
            <button onClick={retake} className="btn-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Retake</button>
            <button onClick={handleVerify} disabled={verifying} className="btn-primary">
              {verifying ? 'Verifying...' : 'Use This Photo'}
            </button>
          </div>
        </motion.div>
      )}

      {step === 'result' && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card text-center">
            {result.faceDetected ? <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" /> : <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />}
            <h2 className="text-xl font-bold text-gray-800">Selfie Verification Complete</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Face Detected', value: result.faceDetected },
              { label: 'Image Quality', value: result.imageQuality },
              { label: 'Liveness Check', value: result.livenessCheck },
              { label: 'Face Match', value: `${result.faceMatchScore}%` },
            ].map((item, idx) => (
              <div key={idx} className="card">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className={`text-lg font-semibold ${item.value === true || (typeof item.value === 'string') ? 'text-green-600' : 'text-gray-800'}`}>
                  {typeof item.value === 'boolean' ? (item.value ? '✓ Pass' : '✗ Fail') : item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="card text-center">
            <button onClick={() => { setStep('consent'); setCapturedImage(null); setResult(null); }} className="btn-secondary">Verify Another</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
