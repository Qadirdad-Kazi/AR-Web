import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, Monitor, AlertTriangle, Download } from 'lucide-react';

interface ARViewerProps {
  glbUrl?: string;
  usdzUrl?: string;
  modelName: string;
}

const ARViewer: React.FC<ARViewerProps> = ({ glbUrl, usdzUrl, modelName }) => {
  const modelViewerRef = useRef<any>(null);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [arSupported, setArSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    
    if (isIOS) {
      setDeviceType('ios');
      setArSupported(!!usdzUrl);
    } else if (isAndroid) {
      setDeviceType('android');
      // Check for WebXR support
      if ('xr' in navigator) {
        navigator.xr?.isSessionSupported('immersive-ar').then(supported => {
          setArSupported(supported && !!glbUrl);
        });
      } else {
        setArSupported(!!glbUrl);
      }
    } else {
      setDeviceType('desktop');
      setArSupported(false);
    }

    // Load model-viewer
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer@^3.4.0/dist/model-viewer.min.js';
    
    script.onload = () => {
      setLoading(false);
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src*="model-viewer"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [glbUrl, usdzUrl]);

  const getModelUrl = () => {
    if (deviceType === 'ios' && usdzUrl) {
      return usdzUrl;
    }
    return glbUrl;
  };

  const getArModes = () => {
    const modes = [];
    if (deviceType === 'ios' && usdzUrl) {
      modes.push('quick-look');
    }
    if (deviceType === 'android' && glbUrl) {
      modes.push('webxr', 'scene-viewer');
    }
    return modes.join(' ');
  };

  if (loading) {
    return (
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AR viewer...</p>
        </div>
      </div>
    );
  }

  if (!glbUrl && !usdzUrl) {
    return (
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">Model files not available</p>
          <p className="text-sm text-gray-500 mt-2">
            The model is still being processed. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Device Info */}
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-3">
          {deviceType === 'desktop' ? (
            <Monitor className="w-5 h-5 text-blue-600" />
          ) : (
            <Smartphone className="w-5 h-5 text-blue-600" />
          )}
          <div>
            <p className="font-medium text-blue-900">
              {deviceType === 'ios' && 'iOS Device Detected'}
              {deviceType === 'android' && 'Android Device Detected'}
              {deviceType === 'desktop' && 'Desktop Browser'}
            </p>
            <p className="text-sm text-blue-700">
              {arSupported ? 'AR viewing supported' : '3D viewer only'}
            </p>
          </div>
        </div>
        
        {arSupported && (
          <div className="text-right">
            <p className="text-xs text-blue-600 font-medium">Tap model to view in AR</p>
          </div>
        )}
      </div>

      {/* Model Viewer */}
      <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
        <model-viewer
          ref={modelViewerRef}
          src={getModelUrl()}
          ar={arSupported}
          ar-modes={getArModes()}
          camera-controls={true}
          touch-action="pan-y"
          auto-rotate={true}
          auto-rotate-delay="3000"
          rotation-per-second="40deg"
          environment-image="https://modelviewer.dev/shared-assets/environments/moon_1k.hdr"
          shadow-intensity="1"
          shadow-softness="0.5"
          exposure="1"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1f2937'
          }}
          loading="lazy"
        >
          {/* Loading indicator */}
          <div slot="progress-bar" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontFamily: 'system-ui',
            fontSize: '14px'
          }}>
            Loading 3D model...
          </div>

          {/* AR Button */}
          {arSupported && (
            <button
              slot="ar-button"
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Smartphone style={{ width: '16px', height: '16px' }} />
              View in AR
            </button>
          )}

          {/* Controls hint */}
          <div slot="interaction-prompt" style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px',
            fontFamily: 'system-ui'
          }}>
            {deviceType === 'desktop' ? 'Click and drag to rotate • Scroll to zoom' : 'Touch to rotate • Pinch to zoom'}
          </div>
        </model-viewer>
      </div>

      {/* Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">3D Viewer</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Rotate: Click/touch and drag</li>
            <li>• Zoom: Scroll wheel or pinch</li>
            <li>• Auto-rotate after 3 seconds</li>
          </ul>
        </div>
        
        {arSupported && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">AR Mode</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tap "View in AR" button</li>
              <li>• Point camera at flat surface</li>
              <li>• Tap to place model</li>
              <li>• Pinch to resize</li>
            </ul>
          </div>
        )}
      </div>

      {/* Download Options */}
      {(glbUrl || usdzUrl) && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Download Model</h4>
          <div className="flex flex-wrap gap-2">
            {glbUrl && (
              <a
                href={glbUrl}
                download={`${modelName}.glb`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span>GLB Format</span>
              </a>
            )}
            {usdzUrl && (
              <a
                href={usdzUrl}
                download={`${modelName}.usdz`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span>USDZ Format</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ARViewer;