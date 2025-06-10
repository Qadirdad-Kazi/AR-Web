import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Eye, Calendar, BarChart3, Smartphone, Monitor, AlertTriangle } from 'lucide-react';
import ARViewer from '../components/ARViewer';
import { getModel } from '../services/api';

interface ModelData {
  _id: string;
  name: string;
  description: string;
  glbFile?: {
    secure_url: string;
  };
  usdzFile?: {
    secure_url: string;
  };
  thumbnail?: {
    secure_url: string;
  };
  fileSize: number;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  tags: string[];
}

const ModelViewer = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ar' | 'info'>('ar');

  useEffect(() => {
    if (id) {
      fetchModel(id);
    }
  }, [id]);

  const fetchModel = async (modelId: string) => {
    try {
      setLoading(true);
      const modelData = await getModel(modelId);
      setModel(modelData);
    } catch (err: any) {
      setError(err.message || 'Failed to load model');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      // Update download count
      if (model) {
        await fetch(`/api/models/${model._id}/download`, { method: 'POST' });
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: model?.name || 'AR Model',
          text: model?.description || 'Check out this AR model!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading model...</p>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Model Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The requested model could not be found.'}
          </p>
          <Link
            to="/models"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/models"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AR Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('ar')}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                      activeTab === 'ar'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>AR Viewer</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                      activeTab === 'info'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>3D Preview</span>
                  </button>
                </nav>
              </div>

              {/* Viewer Content */}
              <div className="aspect-w-16 aspect-h-9">
                {activeTab === 'ar' && model.glbFile && (
                  <ARViewer
                      modelName={model.name}
                      glbUrl={model.glbFile.secure_url}
                      usdzUrl={model.usdzFile?.secure_url}
                      posterUrl={model.thumbnail?.secure_url}
                    />
                )}
                {/* Add 3D Preview component here if you have one */}
              </div>
            </div>
          </div>

          {/* Model Info */}
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {model.name}
              </h1>
              
              {model.description && (
                <p className="text-gray-600 mb-4">
                  {model.description}
                </p>
              )}

              {/* Tags */}
              {model.tags && model.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {model.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{model.viewCount} views</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">{model.downloadCount} downloads</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">{formatFileSize(model.fileSize)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(model.createdAt)}</span>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Download</h3>
                
                {model.glbFile && (
                  <button 
                    onClick={() => model.glbFile && handleDownload(model.glbFile.secure_url, `${model.name}.glb`)}
                    disabled={!model.glbFile}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download .GLB</span>
                  </button>
                )}
                
                {model.usdzFile && (
                  <button
                    onClick={() => handleDownload(model.usdzFile!.secure_url, `${model.name}.usdz`)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download USDZ</span>
                  </button>
                )}
              </div>
            </div>

            {/* Device Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Device Support</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">iOS Devices</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    {model.usdzFile ? 'Supported' : 'Converting...'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Android Devices</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    {model.glbFile ? 'Supported' : 'Processing...'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Desktop</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">3D Viewer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelViewer;