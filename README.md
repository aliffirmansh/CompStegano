# CompStegano - Advanced Masking & Filtering Suite

CompStegano is a cutting-edge web application that provides advanced steganography and media compression capabilities using sophisticated masking and filtering algorithms. Built with React and TypeScript, it offers a sleek, professional interface inspired by modern design principles.

## Features

### Advanced Steganography
- **Masking & Filtering Algorithm**: State-of-the-art techniques for secure message embedding
- **Multi-Channel Embedding**: Uses multiple color channels with advanced masking
- **Frequency Domain Filtering**: Optimal position selection using frequency analysis
- **Adaptive Masking Strength**: Configurable masking intensity for security vs. detectability
- **Multi-format Support**: Works with images (PNG, BMP), audio (WAV, MP3), and video (MP4) files
- **Real-time Processing**: Fast encoding and decoding operations
- **Browser Playback**: Play audio and video files directly in the browser after processing

### Advanced Compression
- **Multi-Algorithm Compression**: Intelligent compression using multiple techniques
- **Adaptive Quality Control**: Dynamic quality adjustment based on compression level
- **Frequency-Based Optimization**: Advanced filtering for optimal compression
- **Progressive Compression**: Multiple compression levels from light to maximum
- **Format Optimization**: Automatic format selection for best compression ratio
- **Decompression**: Intelligent restoration of compressed files
- **Real-time Analysis**: Detailed compression statistics and performance metrics

### Modern User Interface
- **Adidas-Inspired Design**: Professional black, white, and accent color palette
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Sidebar Navigation**: Clean, organized interface with contextual information
- **Dark Theme**: Modern dark interface with gradient accents
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Real-time Feedback**: Progress indicators and detailed status updates
- **Advanced Controls**: Granular control over algorithm parameters

## Supported File Formats

### Images
- PNG (Portable Network Graphics)
- BMP (Bitmap)

### Audio
- WAV (Wave Audio File)
- MP3 (MPEG Audio Layer III)

### Video
- MP4 (MPEG-4 Video)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd compstegano
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Usage

### Steganography

#### Hiding Messages
1. Select the "Steganography" tab from the sidebar
2. Choose "Encode Message" mode
3. Upload your media file (image, audio, or video)
4. Adjust the masking strength for desired security level
5. Enter your secret message in the text area
6. Click "Hide Message" to process the file
7. Download the result file containing the hidden message

#### Extracting Messages
1. Select the "Steganography" tab from the sidebar
2. Choose "Decode Message" mode
3. Upload a media file that contains a hidden message
4. Set the same masking strength used during encoding
5. Click "Extract Message" to reveal the hidden content
6. The extracted message will be displayed in the interface

### Compression

#### Compressing Files
1. Select the "Compression" tab from the sidebar
2. Choose "Compress" mode
3. Upload your media file
4. Adjust the quality level for desired output quality
5. Set the compression intensity (1-9 scale)
6. Click "Compress File" to process
7. Compare file sizes and download the compressed result

#### Decompressing Files
1. Select the "Compression" tab from the sidebar
2. Choose "Decompress" mode
3. Upload a compressed media file
4. Click "Decompress File" to restore
5. Download the decompressed result

## Technical Implementation

### Masking & Filtering Algorithm
The application uses advanced masking and filtering techniques:
- **Multi-Channel Masking**: Messages are embedded across multiple color channels with different masking patterns
- **Frequency Domain Filtering**: Optimal embedding positions are selected using frequency analysis
- **Adaptive Masking**: Masking strength can be adjusted for different security requirements
- **Error Correction**: Built-in redundancy for reliable message extraction

### Advanced Compression Methods
- **Images**: Canvas-based compression with multiple algorithms and format optimization
- **Audio**: Sample rate reduction, bit depth optimization, and frequency filtering
- **Video**: Frame reduction simulation and advanced bit manipulation
- **Adaptive Algorithms**: Compression strategy changes based on content type and quality settings

### Security Considerations
- All processing is done client-side for privacy
- No data is transmitted to external servers
- Files are processed entirely in the browser environment
- Advanced masking provides additional security layers

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Limitations
- File size limits depend on browser memory constraints
- Video steganography uses simplified implementation for demonstration
- Compression algorithms are optimized for demonstration purposes
- Some file formats may have limited browser support

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── SteganographyPanel.tsx
│   ├── CompressionPanel.tsx
│   ├── FileUpload.tsx
│   └── FilePreview.tsx
├── utils/              # Utility functions and algorithms
│   ├── steganography.ts # Masking & filtering algorithms
│   ├── compression.ts   # Advanced compression methods
│   └── fileUtils.ts     # File handling utilities
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

### Key Technologies
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- HTML5 Canvas API for image processing
- Web Audio API for audio processing
- File API for file handling
- Advanced masking and filtering algorithms

## Algorithm Details

### Masking Algorithm
- Generates pseudo-random masks based on configurable strength
- Applies masks across multiple data channels
- Uses frequency domain analysis for optimal positioning
- Provides reversible masking for accurate extraction

### Filtering Techniques
- Frequency-based position selection
- Multi-channel redundancy
- Adaptive threshold adjustment
- Error correction and validation

## Contributing
This project demonstrates advanced steganography and compression techniques using modern web technologies. The implementation focuses on educational value, user experience, and showcasing sophisticated algorithms in a browser environment.

## License
This project is available for educational and demonstration purposes.