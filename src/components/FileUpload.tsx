import React, { useCallback } from 'react';
import { Upload, File, Image, Music, Video, Plus } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  title: string;
  description: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes,
  title,
  description
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragOver 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="bg-white rounded-full"></div>
            ))}
          </div>
        </div>
        
        <div className="relative flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-400 rounded-2xl blur opacity-75"></div>
            <div className="relative p-4 bg-gray-800 rounded-2xl">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <Image className="w-4 h-4" />
              <span className="text-xs">Images</span>
            </div>
            <div className="flex items-center space-x-1">
              <Music className="w-4 h-4" />
              <span className="text-xs">Audio</span>
            </div>
            <div className="flex items-center space-x-1">
              <Video className="w-4 h-4" />
              <span className="text-xs">Video</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Plus className="w-3 h-3" />
            <span>Click to browse or drag and drop</span>
          </div>
        </div>
        
        <input
          id="file-input"
          type="file"
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};