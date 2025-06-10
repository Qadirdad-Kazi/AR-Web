import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Download, Calendar, BarChart3, Smartphone } from 'lucide-react';

interface ModelCardProps {
  model: {
    _id: string;
    name: string;
    description: string;
    thumbnail: {
      secure_url: string;
    };
    glbFile?: {
      secure_url: string;
    };
    usdzFile?: {
      secure_url: string;
    };
    fileSize: number;
    viewCount: number;
    downloadCount: number;
    createdAt: string;
  };
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      await fetch(`/api/models/${model._id}/download`, { method: 'POST' });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={model.thumbnail?.secure_url || '/api/placeholder/400/300'}
          alt={model.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/model/${model._id}`}
            className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>View in AR</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {model.name}
        </h3>
        
        {model.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {model.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{model.viewCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-3 h-3" />
            <span>{model.downloadCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 className="w-3 h-3" />
            <span>{formatFileSize(model.fileSize)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(model.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            to={`/model/${model._id}`}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
          >
            View AR
          </Link>
          
          {(model.glbFile || model.usdzFile) && (
            <div className="flex space-x-1">
              {model.glbFile && (
                <button
                  onClick={() => handleDownload(model.glbFile!.secure_url, `${model.name}.glb`)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  title="Download GLB"
                >
                  GLB
                </button>
              )}
              {model.usdzFile && (
                <button
                  onClick={() => handleDownload(model.usdzFile!.secure_url, `${model.name}.usdz`)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  title="Download USDZ"
                >
                  USDZ
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelCard;