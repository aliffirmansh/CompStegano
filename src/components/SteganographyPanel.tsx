import React, { useState } from 'react';
import { Shield, Lock, Unlock, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { FilePreview } from './FilePreview';
import { MaskingFilteringSteganography } from '../utils/steganography';
import { getFileType } from '../utils/fileUtils';
import { SteganographyResult } from '../types';

export const SteganographyPanel: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resultFile, setResultFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [extractedMessage, setExtractedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [result, setResult] = useState<SteganographyResult | null>(null);
  const [maskingStrength, setMaskingStrength] = useState(0.5);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setResultFile(null);
    setExtractedMessage('');
    setResult(null);
  };

  const handleEncode = async () => {
    if (!originalFile || !message.trim()) return;

    setIsProcessing(true);
    const fileType = getFileType(originalFile);
    let result: SteganographyResult;

    try {
      switch (fileType) {
        case 'image':
          result = await MaskingFilteringSteganography.hideMessageInImage(originalFile, message, maskingStrength);
          break;
        case 'audio':
          result = await MaskingFilteringSteganography.hideMessageInAudio(originalFile, message, maskingStrength);
          break;
        case 'video':
          result = await MaskingFilteringSteganography.hideMessageInVideo(originalFile, message, maskingStrength);
          break;
        default:
          result = {
            success: false,
            error: 'Unsupported file type',
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
        processingTime: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecode = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    const fileType = getFileType(originalFile);
    let result: SteganographyResult;

    try {
      switch (fileType) {
        case 'image':
          result = await MaskingFilteringSteganography.extractMessageFromImage(originalFile, maskingStrength);
          break;
        case 'audio':
          result = await MaskingFilteringSteganography.extractMessageFromAudio(originalFile, maskingStrength);
          break;
        case 'video':
          result = await MaskingFilteringSteganography.extractMessageFromVideo(originalFile, maskingStrength);
          break;
        default:
          result = {
            success: false,
            error: 'Unsupported file type',
            processingTime: 0
          };
      }

      setResult(result);
      if (result.success && result.message) {
        setExtractedMessage(result.message);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-75"></div>
            <div className="relative p-3 bg-gray-900 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Masking & Filtering Steganography</h2>
            <p className="text-gray-400">Advanced algorithms for secure message embedding</p>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('encode')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              mode === 'encode'
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Encode Message</div>
                <div className="text-sm opacity-75">Hide secret data</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setMode('decode')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              mode === 'decode'
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Unlock className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Decode Message</div>
                <div className="text-sm opacity-75">Extract hidden data</div>
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
            description="Supports PNG, BMP, WAV, MP3, MP4 files"
          />
        </div>

        {/* Masking Strength Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Masking Strength
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={maskingStrength}
              onChange={(e) => setMaskingStrength(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${maskingStrength * 100}%, #374151 ${maskingStrength * 100}%, #374151 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Subtle</span>
              <span className="font-medium text-blue-400">{Math.round(maskingStrength * 100)}%</span>
              <span>Strong</span>
            </div>
          </div>
        </div>

        {/* Message Input for Encoding */}
        {mode === 'encode' && (
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
              Secret Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message here..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Message length: {message.length} characters</span>
              <span>Estimated capacity: {originalFile ? Math.floor(originalFile.size / 8) : 0} chars</span>
            </div>
          </div>
        )}

        {/* Process Button */}
        <button
          onClick={mode === 'encode' ? handleEncode : handleDecode}
          disabled={isProcessing || !originalFile || (mode === 'encode' && !message.trim())}
          className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 ${
            mode === 'encode'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
          } disabled:bg-gray-600 disabled:cursor-not-allowed`}
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {mode === 'encode' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              <span>{mode === 'encode' ? 'Hide Message' : 'Extract Message'}</span>
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
            <div className="flex items-center space-x-2 mb-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? 'Operation Successful' : 'Operation Failed'}
              </span>
            </div>
            
            {result.error && (
              <p className="text-red-300 text-sm mb-2">{result.error}</p>
            )}
            
            <div className="text-xs text-gray-400">
              Processing time: {result.processingTime}ms
            </div>
          </div>
        )}

        {/* Extracted Message Display */}
        {mode === 'decode' && extractedMessage && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Extracted Message
            </label>
            <div className="bg-gray-700 border border-gray-600 rounded-xl p-4">
              <p className="text-white break-words">{extractedMessage}</p>
            </div>
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
              title="Processed Result"
              showDownload={true}
            />
          )}
        </div>
      )}
    </div>
  );
};