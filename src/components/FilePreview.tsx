import React from 'react';
import { File, Download, Play, Pause, Eye } from 'lucide-react';
import { formatFileSize, createObjectURL, downloadFile } from '../utils/fileUtils';

interface FilePreviewProps {
  file: File;
  title: string;
  showDownload?: boolean;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  title,
  showDownload = true,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [mediaUrl, setMediaUrl] = React.useState<string>('');
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const url = createObjectURL(file);
    setMediaUrl(url);
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleDownload = () => {
    downloadFile(file);
  };

  const togglePlay = () => {
    if (file.type.startsWith('audio/')) {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } else if (file.type.startsWith('video/')) {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const renderMediaPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="relative group">
          <img
            src={mediaUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>
      );
    }

    if (file.type.startsWith('audio/')) {
      return (
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-400 rounded-full blur opacity-75"></div>
            <div className="relative w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
            </div>
          </div>
          <audio
            ref={audioRef}
            src={mediaUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            controls
            className="w-full"
          />
        </div>
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <div className="relative">
          <video
            ref={videoRef}
            src={mediaUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            controls
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-6 flex items-center justify-center">
        <File className="w-16 h-16 text-gray-400" />
      </div>
    );
  };

  return (
    <div className={`bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">{title}</h3>
          {showDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {renderMediaPreview()}
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>File name:</span>
            <span className="font-medium text-white truncate ml-2">{file.name}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Size:</span>
            <span className="font-medium text-white">{formatFileSize(file.size)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Type:</span>
            <span className="font-medium text-white">{file.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};