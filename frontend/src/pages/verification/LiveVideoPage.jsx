import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

export default function LiveVideoPage() {
  const [inCall, setInCall] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const startCall = () => {
    setInCall(true);
    setCallDuration(0);
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    setTimeout(() => clearInterval(timer), 3600000);
  };

  const endCall = () => setInCall(false);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Video Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time video verification with a loan officer</p>
      </div>

      {!inCall ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card text-center py-12">
          <Video className="w-16 h-16 text-primary-pink mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Start Video Verification</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
            Connect with a loan officer for live identity verification. Ensure you have a stable internet connection and proper lighting.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 max-w-sm mx-auto text-left mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Before you start:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Check your camera and microphone</li>
              <li>• Find a quiet, well-lit space</li>
              <li>• Keep your ID documents ready</li>
              <li>• This call will not be recorded</li>
            </ul>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 max-w-sm mx-auto mb-6">
            <p className="text-xs text-blue-700">By joining this call, you consent to live video verification for your loan application.</p>
          </div>
          <button onClick={startCall} className="btn-primary flex items-center gap-2 mx-auto">
            <Phone className="w-4 h-4" /> Join Video Call
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Officer Video */}
            <div className="card p-0 overflow-hidden aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">LO</span>
                </div>
                <p className="text-sm">Loan Officer</p>
                <p className="text-xs text-gray-400">Connecting...</p>
              </div>
            </div>
            {/* Customer Video */}
            <div className="card p-0 overflow-hidden aspect-video bg-gray-800 rounded-2xl flex items-center justify-center relative">
              <div className="text-center text-white">
                <Video className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                <p className="text-sm">Your Camera</p>
              </div>
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                {formatTime(callDuration)}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="card">
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setCameraOn(!cameraOn)} className={`p-3 rounded-full ${cameraOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}>
                {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-full ${micOn ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'}`}>
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button onClick={endCall} className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700">
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500">Connection Status: <span className="text-green-600">Connected</span></p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
