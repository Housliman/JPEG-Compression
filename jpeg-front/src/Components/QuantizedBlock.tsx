import React from 'react';

interface QuantizedBlockProps {
  table: number[][];
}

const QuantizedBlock: React.FC<QuantizedBlockProps> = ({ table }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: 'white' }}>Quantization Table</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '2px',
        backgroundColor: '#444',
        padding: '5px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        {table.flat().map((val, i) => (
          <div key={i} style={{
            backgroundColor: '#222',
            color: '#0f0',
            padding: '4px',
            textAlign: 'center',
            minWidth: '25px'
          }}>
            {val}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuantizedBlock;
