import { useState, useEffect, useRef } from 'react';
import lenaImg from './assets/lena.jpg';
import QuantizedBlock from './Components/QuantizedBlock';

interface BlockData {
  row: number;
  col: number;
  original: number[][];
  processed: number[][];
  non_zero_count: number;
}

function App() {
  const [quality, setQuality] = useState<number>(50);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [qTable, setQTable] = useState<number[][]>([]);
  const [imageSize, setImageSize] = useState<{ h: number, w: number }>({ h: 0, w: 0 });
  const [compressedInfo, setCompressedInfo] = useState<{ original: number, compressed: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speed, setSpeed] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = async () => {
    setIsProcessing(true);
    setCurrentIndex(-1);
    
    // Fetch local lena image as blob
    const response = await fetch(lenaImg);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('file', blob, 'lena.jpg');
    formData.append('quality', quality.toString());
    
    const apiBase = import.meta.env.MODE === 'development' 
      ? 'http://localhost:8000' 
      : '';
    
    try {
      const apiRes = await fetch(`${apiBase}/process`, {
        method: 'POST',
        body: formData,
      });
      const data = await apiRes.json();
      
      setBlocks(data.blocks);
      setQTable(data.q_table);
      setImageSize({ h: data.h, w: data.w });
      setCompressedInfo({ original: data.original_size, compressed: data.compressed_size });
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to process image:", err);
      alert("Backend not reachable. Ensure it's running on localhost:8000");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < blocks.length) {
      const timer = setTimeout(() => {
        const originalCtx = originalCanvasRef.current?.getContext('2d');
        const processedCtx = canvasRef.current?.getContext('2d');
        
        if (!originalCtx || !processedCtx) return;

        const end = Math.min(currentIndex + speed, blocks.length);
        
        for (let i = currentIndex; i < end; i++) {
          const block = blocks[i];
          
          // Draw to original canvas
          const origData = originalCtx.createImageData(8, 8);
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const val = block.original[r][c];
              const idx = (r * 8 + c) * 4;
              origData.data[idx] = val;
              origData.data[idx+1] = val;
              origData.data[idx+2] = val;
              origData.data[idx+3] = 255;
            }
          }
          originalCtx.putImageData(origData, block.col, block.row);

          // Draw to processed canvas
          const procData = processedCtx.createImageData(8, 8);
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const val = block.processed[r][c];
              const idx = (r * 8 + c) * 4;
              procData.data[idx] = val;
              procData.data[idx+1] = val;
              procData.data[idx+2] = val;
              procData.data[idx+3] = 255;
            }
          }
          processedCtx.putImageData(procData, block.col, block.row);
        }
        
        setCurrentIndex(end);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, blocks, speed]);

  const resetCanvases = () => {
    const originalCtx = originalCanvasRef.current?.getContext('2d');
    const processedCtx = canvasRef.current?.getContext('2d');
    if (originalCtx && processedCtx && imageSize.h > 0) {
      originalCtx.fillStyle = '#222';
      originalCtx.fillRect(0, 0, imageSize.w, imageSize.h);
      processedCtx.fillStyle = '#222';
      processedCtx.fillRect(0, 0, imageSize.w, imageSize.h);
    }
  };

  useEffect(() => {
    if (imageSize.h > 0) {
      resetCanvases();
    }
  }, [imageSize]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', minHeight: '100vh', width: '100%', color: 'white', backgroundColor: '#111' }}>
      <h1>JPEG Compression Visualizer</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
        <div>
          <label>Quality Factor: {quality}</label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={quality} 
            onChange={(e) => setQuality(parseInt(e.target.value))}
            style={{ display: 'block' }}
          />
          <select 
            value={quality} 
            onChange={(e) => setQuality(parseInt(e.target.value))}
            style={{ marginTop: '5px' }}
          >
            <option value={10}>Very Low (10)</option>
            <option value={25}>Low (25)</option>
            <option value={50}>Medium (50)</option>
            <option value={75}>High (75)</option>
            <option value={95}>Very High (95)</option>
          </select>
        </div>
        
        <select value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))}>
          <option value={1}>Speed: x1</option>
          <option value={4}>Speed: x4</option>
          <option value={16}>Speed: x16</option>
          <option value={64}>Speed: x64</option>
        </select>
        
        <button 
          onClick={processImage} 
          disabled={isProcessing}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {isProcessing ? 'Processing...' : 'Start Compression'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Original (Grayscale)</h3>
          <canvas 
            ref={originalCanvasRef} 
            width={imageSize.w || 512} 
            height={imageSize.h || 512}
            style={{ border: '1px solid #333', backgroundColor: '#222' }}
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h3>Processed (DCT + Quantization)</h3>
          <canvas 
            ref={canvasRef} 
            width={imageSize.w || 512} 
            height={imageSize.h || 512}
            style={{ border: '1px solid #333', backgroundColor: '#222' }}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '40px' }}>
        {compressedInfo && (
          <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px' }}>
            <h3>Statistics</h3>
            <p>Original Size: {(compressedInfo.original / 1024).toFixed(2)} KB</p>
            <p>Estimated JPG Size: {(compressedInfo.compressed / 1024).toFixed(2)} KB</p>
            <p>Compression Ratio: {(compressedInfo.original / compressedInfo.compressed).toFixed(2)}:1</p>
            <p>Blocks processed: {currentIndex < 0 ? 0 : Math.min(currentIndex, blocks.length)} / {blocks.length}</p>
          </div>
        )}
        
        {qTable.length > 0 && (
          <QuantizedBlock table={qTable} />
        )}
      </div>

      <div style={{ marginTop: '40px', maxWidth: '800px', textAlign: 'left', lineHeight: '1.6', color: '#ccc' }}>
        <h3>How it works:</h3>
        <ol>
          <li><b>Image is converted to grayscale</b> (for this demonstration).</li>
          <li><b>Splitting into 8x8 blocks:</b> JPEG doesn't compress the whole image at once.</li>
          <li><b>Discrete Cosine Transform (DCT):</b> Converts image data from spatial to frequency domain.</li>
          <li><b>Quantization:</b> This is where the loss happens. Frequencies are divided by values in the Quantization Table and rounded. Lower quality means higher quantization values, leading to more zero coefficients.</li>
          <li><b>Dequantization & IDCT:</b> To display the result, we reverse the process.</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
