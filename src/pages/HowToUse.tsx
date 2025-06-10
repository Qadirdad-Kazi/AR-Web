import React from 'react';
import { Smartphone, Monitor, Download, Upload, Eye, Zap, Apple, Bot } from 'lucide-react';

const HowToUse = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Model',
      description: 'Upload .glb, .gltf, or .usdz files up to 50MB',
      details: [
        'Drag and drop or click to browse',
        'Automatic format conversion',
        'Thumbnail generation',
        'Metadata extraction'
      ]
    },
    {
      icon: Eye,
      title: 'View in Gallery',
      description: 'Browse models in our interactive gallery',
      details: [
        'Search and filter models',
        'View statistics and info',
        'Download in multiple formats',
        'Share with others'
      ]
    },
    {
      icon: Smartphone,
      title: 'Experience in AR',
      description: 'View models in augmented reality on your device',
      details: [
        'iOS: Quick Look AR viewer',
        'Android: WebXR support',
        'Tap to place models',
        'Touch to rotate and scale'
      ]
    }
  ];

  const devices = [
    {
      category: 'iOS Devices',
      icon: Apple,
      requirements: [
        'iOS 13.0 or later',
        'Safari browser',
        'ARKit compatible device',
        'iPhone 6S or newer',
        'iPad (5th generation) or newer'
      ],
      format: 'USDZ',
      viewer: 'Quick Look'
    },
    {
      category: 'Android Devices',
      icon: Bot,
      requirements: [
        'Android 8.0 or later',
        'Chrome 81+ browser',
        'ARCore compatible device',
        'WebXR support',
        'OpenGL ES 3.0'
      ],
      format: 'GLB',
      viewer: 'WebXR'
    },
    {
      category: 'Desktop',
      icon: Monitor,
      requirements: [
        'Modern web browser',
        'WebGL support',
        'Chrome, Firefox, Safari, Edge',
        'No AR support (3D viewer only)',
        'Hardware acceleration recommended'
      ],
      format: 'GLB',
      viewer: '3D Viewer'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How to Use AR Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn how to upload, share, and view 3D models in augmented reality
          </p>
        </div>

        {/* How it Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How it Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  
                  <ul className="text-sm text-gray-500 space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Device Compatibility */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Device Compatibility
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {devices.map((device, index) => {
              const Icon = device.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {device.category}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {device.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Format:</span>
                        <span className="font-medium text-gray-900">{device.format}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Viewer:</span>
                        <span className="font-medium text-gray-900">{device.viewer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* File Formats */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Supported File Formats
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                format: 'GLB',
                description: 'Binary glTF format',
                features: ['Compact file size', 'Embedded textures', 'Wide compatibility', 'WebXR support'],
                bestFor: 'Web and Android AR'
              },
              {
                format: 'GLTF',
                description: 'JSON-based 3D format',
                features: ['Human readable', 'Separate asset files', 'Easy to edit', 'Industry standard'],
                bestFor: 'Development and editing'
              },
              {
                format: 'USDZ',
                description: 'Apple\'s AR format',
                features: ['iOS native support', 'Quick Look integration', 'High quality rendering', 'iOS optimized'],
                bestFor: 'iOS AR experiences'
              }
            ].map((format, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{format.format}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {format.format} Files
                  </h3>
                  <p className="text-gray-600">
                    {format.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {format.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <Zap className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Best for:</p>
                    <p className="font-medium text-gray-900">{format.bestFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tips for Best Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Model Optimization</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Keep polygon count under 100k for mobile devices</li>
                <li>• Use compressed textures (JPG instead of PNG when possible)</li>
                <li>• Optimize model scale for AR viewing</li>
                <li>• Test on target devices before sharing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">AR Experience</h3>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Use good lighting for better AR tracking</li>
                <li>• Ensure stable surface for model placement</li>
                <li>• Allow camera permissions when prompted</li>
                <li>• Update your browser for latest AR features</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToUse;