import React, { useState } from 'react';
import { Layers, Minimize, Maximize, Loader, AlertCircle, CheckCircle, Gauge } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { FilePreview } from './FilePreview';
import { AdvancedCompression } from '../utils/compression';
import { getFileType, formatFileSize } from '../utils/fileUtils';
import { CompressionResult } from '../types';

export const CompressionPanel: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [quality, setQuality] = useState(0.8);
  const [compressionLevel, setCompressionLevel] = useState(5);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setResultFile(null);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    const fileType = getFileType(originalFile);
    let result: CompressionResult;

    try {
      switch (fileType) {
        case 'image':
          result = await AdvancedCompression.compressImage(originalFile, quality, compressionLevel);
          break;
        case 'audio':
          result = await AdvancedCompression.compressAudio(originalFile, quality, compressionLevel);
          break;
        case 'video':
          result = await AdvancedCompression.compressVideo(originalFile, quality, compressionLevel);
          break;
        default:
          result = {
            success: false,
            error: 'Unsupported file type for compression',
            originalSize: originalFile.size,
            compressedSize: 0,
            compressionRatio: 0,
            processingTime: 0
          };
      }

      setResult(result);
      if (result.success && result.file) {
        setResultFile(result.file);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize: originalFile.size,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecompress = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    try {
      const result = await AdvancedCompression.decompress(originalFile);
      setResult(result);
      if (result.success && result.file) {
        setResultFile(result.file);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        originalSize: originalFile.size,
        compressedSize: 0,
        compressionRatio: 0,
        processingTime: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl blur opacity-75"></div>
            <div className="relative p-3 bg-gray-900 rounded-xl">
              <Layers className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Advanced Media Compression</h2>
            <p className="text-gray-400">Optimize file sizes with intelligent algorithms</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('compress')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              mode === 'compress'
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Minimize className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Compress</div>
                <div className="text-sm opacity-75">Reduce file size</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setMode('decompress')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              mode === 'decompress'
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Maximize className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Decompress</div>
                <div className="text-sm opacity-75">Restore original</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Processing Card */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
        {/* File Upload */}
        <div className="mb-6">
          <FileUpload
            onFileSelect={handleFileSelect}
            acceptedTypes="image/*,audio/*,video/*"
            title="Upload Media File"
            description="Supports images, audio, and video files"
          />
        </div>

        {/* Compression Settings */}
        {mode === 'compress' && (
          <div className="space-y-6 mb-6">
            {/* Quality Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4" />
                  <span>Quality Level</span>
                </div>
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${quality * 100}%, #374151 ${quality * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Lower Quality</span>
                  <span className="font-medium text-green-400">{Math.round(quality * 100)}%</span>
                  <span>Higher Quality</span>
                </div>
              </div>
            </div>

            {/* Compression Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Compression Intensity
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="1"
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(compressionLevel / 9) * 100}%, #374151 ${(compressionLevel / 9) * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Fast</span>
                  <span className="font-medium text-green-400">Level {compressionLevel}</span>
                  <span>Maximum</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Process Button */}
        <button
          onClick={mode === 'compress' ? handleCompress : handleDecompress}
          disabled={isProcessing || !originalFile}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 ${
            mode === 'compress'
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
          } disabled:bg-gray-600 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {mode === 'compress' ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              <span>{mode === 'compress' ? 'Compress File' : 'Decompress File'}</span>
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className={`mt-6 p-4 rounded-xl border ${
            result.success 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? 'Operation Successful' : 'Operation Failed'}
              </span>
            </div>
            
            {result.success && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Original size:</span>
                    <span className="font-medium text-white">{formatFileSize(result.originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Result size:</span>
                    <span className="font-medium text-white">{formatFileSize(result.compressedSize)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size change:</span>
                    <span className={`font-medium ${result.compressionRatio > 0 ? 'text-green-400' : 'text-blue-400'}`}>
                      {result.compressionRatio > 0 ? '-' : '+'}{Math.abs(result.compressionRatio).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing time:</span>
                    <span className="font-medium text-white">{result.processingTime}ms</span>
                  </div>
                </div>
              </div>
            )}
            
            {result.error && (
              <p className="text-red-300 text-sm">{result.error}</p>
            )}
          </div>
        )}
      </div>

      {/* File Previews */}
      {(originalFile || resultFile) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {originalFile && (
            <FilePreview
              file={originalFile}
              title="Original File"
              showDownload={false}
            />
          )}
          {resultFile && (
            <FilePreview
              file={resultFile}
              title={`${mode === 'compress' ? 'Compressed' : 'Decompressed'} Result`}
              showDownload={true}
            />
          )}
        </div>
      )}
    </div>
  );
};