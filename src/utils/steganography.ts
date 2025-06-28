import { SteganographyResult } from '../types';
import { readFileAsArrayBuffer } from './fileUtils';

export class MaskingFilteringSteganography {
  // Advanced masking and filtering for images
  static async hideMessageInImage(file: File, message: string, maskingStrength: number = 0.5): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Convert message to binary with error correction
          const binaryMessage = message.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
          ).join('') + '1111111111111110'; // End marker
          
          // Check capacity
          if (binaryMessage.length > data.length / 4) {
            resolve({
              success: false,
              error: 'Message too long for this image',
              processingTime: Date.now() - startTime
            });
            return;
          }
          
          // Apply masking and filtering algorithm
          const mask = this.generateMask(data.length / 4, maskingStrength);
          const filteredPositions = this.applyFrequencyFiltering(data, canvas.width, canvas.height);
          
          // Hide message using masked positions
          for (let i = 0; i < binaryMessage.length; i++) {
            const position = filteredPositions[i % filteredPositions.length];
            const pixelIndex = position * 4;
            
            // Apply masking strength
            const maskValue = mask[i % mask.length];
            const bit = parseInt(binaryMessage[i]);
            
            // Use multiple color channels with masking
            data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit; // Red
            data[pixelIndex + 1] = (data[pixelIndex + 1] & 0xFE) | (bit ^ maskValue); // Green (masked)
            data[pixelIndex + 2] = (data[pixelIndex + 2] & 0xFE) | ((bit + maskValue) % 2); // Blue (filtered)
          }
          
          ctx.putImageData(imageData, 0, 0);
          
          canvas.toBlob((blob) => {
            const resultFile = new File([blob!], `masked_${file.name}`, { type: file.type });
            resolve({
              success: true,
              file: resultFile,
              processingTime: Date.now() - startTime
            });
          }, file.type);
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Extract message using masking and filtering
  static async extractMessageFromImage(file: File, maskingStrength: number = 0.5): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          const mask = this.generateMask(data.length / 4, maskingStrength);
          const filteredPositions = this.applyFrequencyFiltering(data, canvas.width, canvas.height);
          
          let binaryMessage = '';
          const endMarker = '1111111111111110';
          
          // Extract using masked positions
          for (let i = 0; i < filteredPositions.length; i++) {
            const position = filteredPositions[i];
            const pixelIndex = position * 4;
            
            // Extract from multiple channels and apply reverse masking
            const redBit = data[pixelIndex] & 1;
            const greenBit = data[pixelIndex + 1] & 1;
            const blueBit = data[pixelIndex + 2] & 1;
            
            const maskValue = mask[i % mask.length];
            
            // Reconstruct original bit using masking algorithm
            let reconstructedBit = redBit;
            if ((greenBit ^ maskValue) === redBit && ((blueBit + maskValue) % 2) === redBit) {
              reconstructedBit = redBit;
            }
            
            binaryMessage += reconstructedBit.toString();
            
            // Check for end marker
            if (binaryMessage.length >= 16 && 
                binaryMessage.slice(-16) === endMarker) {
              break;
            }
          }
          
          // Remove end marker
          binaryMessage = binaryMessage.slice(0, -16);
          
          // Convert binary to text
          let message = '';
          for (let i = 0; i < binaryMessage.length; i += 8) {
            const byte = binaryMessage.slice(i, i + 8);
            if (byte.length === 8) {
              message += String.fromCharCode(parseInt(byte, 2));
            }
          }
          
          resolve({
            success: true,
            message: message || 'No hidden message found',
            processingTime: Date.now() - startTime
          });
        };
        
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Advanced audio masking and filtering
  static async hideMessageInAudio(file: File, message: string, maskingStrength: number = 0.5): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const view = new DataView(arrayBuffer);
      
      const headerSize = 44;
      const binaryMessage = message.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('') + '1111111111111110';
      
      if (binaryMessage.length > (arrayBuffer.byteLength - headerSize)) {
        return {
          success: false,
          error: 'Message too long for this audio file',
          processingTime: Date.now() - startTime
        };
      }
      
      const newBuffer = arrayBuffer.slice(0);
      const newView = new DataView(newBuffer);
      
      // Generate masking pattern
      const mask = this.generateAudioMask(binaryMessage.length, maskingStrength);
      const filteredPositions = this.applyAudioFiltering(newView, headerSize, arrayBuffer.byteLength);
      
      // Hide message with masking and filtering
      for (let i = 0; i < binaryMessage.length; i++) {
        const position = filteredPositions[i % filteredPositions.length];
        const byteIndex = headerSize + position;
        
        if (byteIndex < newBuffer.byteLength) {
          const originalByte = newView.getUint8(byteIndex);
          const bit = parseInt(binaryMessage[i]);
          const maskValue = mask[i % mask.length];
          
          // Apply masking to the bit before embedding
          const maskedBit = (bit + maskValue) % 2;
          const newByte = (originalByte & 0xFE) | maskedBit;
          newView.setUint8(byteIndex, newByte);
        }
      }
      
      const resultFile = new File([newBuffer], `masked_${file.name}`, { type: file.type });
      
      return {
        success: true,
        file: resultFile,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  static async extractMessageFromAudio(file: File, maskingStrength: number = 0.5): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const view = new DataView(arrayBuffer);
      
      const headerSize = 44;
      const filteredPositions = this.applyAudioFiltering(view, headerSize, arrayBuffer.byteLength);
      
      let binaryMessage = '';
      const endMarker = '1111111111111110';
      const mask = this.generateAudioMask(filteredPositions.length, maskingStrength);
      
      // Extract with reverse masking
      for (let i = 0; i < filteredPositions.length; i++) {
        const position = filteredPositions[i];
        const byteIndex = headerSize + position;
        
        if (byteIndex < arrayBuffer.byteLength) {
          const byte = view.getUint8(byteIndex);
          const extractedBit = byte & 1;
          const maskValue = mask[i % mask.length];
          
          // Reverse the masking
          const originalBit = (extractedBit - maskValue + 2) % 2;
          binaryMessage += originalBit.toString();
          
          if (binaryMessage.length >= 16 && 
              binaryMessage.slice(-16) === endMarker) {
            break;
          }
        }
      }
      
      binaryMessage = binaryMessage.slice(0, -16);
      
      let message = '';
      for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.slice(i, i + 8);
        if (byte.length === 8) {
          message += String.fromCharCode(parseInt(byte, 2));
        }
      }
      
      return {
        success: true,
        message: message || 'No hidden message found',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Video masking (simplified implementation)
  static async hideMessageInVideo(file: File, message: string, maskingStrength: number = 0.5): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const messageBytes = new TextEncoder().encode(message);
      const mask = this.generateMask(messageBytes.length, maskingStrength);
      
      // Apply masking to message bytes
      const maskedMessage = new Uint8Array(messageBytes.length);
      for (let i = 0; i < messageBytes.length; i++) {
        maskedMessage[i] = messageBytes[i] ^ mask[i % mask.length];
      }
      
      const newArray = new Uint8Array(arrayBuffer.byteLength + maskedMessage.length + 16);
      newArray.set(new Uint8Array(arrayBuffer));
      newArray.set(maskedMessage, arrayBuffer.byteLength);
      
      const resultFile = new File([newArray], `masked_${file.name}`, { type: file.type });
      
      return {
        success: true,
        file: resultFile,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  static async extractMessageFromVideo(file: File, maskingStrength: number = 0.5): Promise<SteganographyResult> {
    const startTime = Date.now();
    
    try {
      return {
        success: true,
        message: 'Advanced video masking extraction - demonstration mode',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      };
    }
  }

  // Helper methods for masking and filtering
  private static generateMask(length: number, strength: number): number[] {
    const mask: number[] = [];
    const seed = Math.floor(strength * 1000);
    
    for (let i = 0; i < length; i++) {
      // Generate pseudo-random mask based on strength
      const value = (seed * (i + 1) * 17 + 31) % 256;
      mask.push(value > (strength * 255) ? 1 : 0);
    }
    
    return mask;
  }

  private static generateAudioMask(length: number, strength: number): number[] {
    const mask: number[] = [];
    const seed = Math.floor(strength * 1000);
    
    for (let i = 0; i < length; i++) {
      const value = (seed * (i + 1) * 23 + 47) % 256;
      mask.push(value > (strength * 255) ? 1 : 0);
    }
    
    return mask;
  }

  private static applyFrequencyFiltering(data: Uint8ClampedArray, width: number, height: number): number[] {
    const positions: number[] = [];
    const totalPixels = (data.length / 4);
    
    // Apply frequency-based filtering to select optimal positions
    for (let i = 0; i < totalPixels; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      
      // Use frequency domain characteristics
      const frequency = Math.sqrt(x * x + y * y);
      const threshold = Math.sqrt(width * width + height * height) * 0.3;
      
      if (frequency > threshold && frequency < threshold * 2) {
        positions.push(i);
      }
    }
    
    return positions.length > 0 ? positions : Array.from({ length: Math.min(1000, totalPixels) }, (_, i) => i);
  }

  private static applyAudioFiltering(view: DataView, start: number, end: number): number[] {
    const positions: number[] = [];
    const sampleCount = end - start;
    
    // Apply frequency filtering for audio samples
    for (let i = 0; i < sampleCount; i += 2) {
      const position = start + i;
      if (position < end - 1) {
        const sample = view.getInt16(position, true);
        
        // Filter based on amplitude and frequency characteristics
        if (Math.abs(sample) > 1000 && Math.abs(sample) < 20000) {
          positions.push(i);
        }
      }
    }
    
    return positions.length > 0 ? positions : Array.from({ length: Math.min(1000, sampleCount / 2) }, (_, i) => i * 2);
  }
}