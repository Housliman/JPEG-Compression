import numpy as np
from scipy.fftpack import dct, idct

# Standard Luminance Quantization Table
QUANTIZATION_TABLE = np.array([
    [16, 11, 10, 16, 24, 40, 51, 61],
    [12, 12, 14, 19, 26, 58, 60, 55],
    [14, 13, 16, 24, 40, 57, 69, 56],
    [14, 17, 22, 29, 51, 87, 80, 62],
    [18, 22, 37, 56, 68, 109, 103, 77],
    [24, 35, 55, 64, 81, 104, 113, 92],
    [49, 64, 78, 87, 103, 121, 120, 101],
    [72, 92, 95, 98, 112, 100, 103, 99]
], dtype=np.float32)

def get_quantization_table(quality):
    """
    Adjusts the quantization table based on the quality factor.
    Quality factor is between 1 and 100.
    """
    if quality <= 0:
        quality = 1
    if quality > 100:
        quality = 100
        
    if quality < 50:
        scale = 5000 / quality
    else:
        scale = 200 - quality * 2
    
    table = np.floor((QUANTIZATION_TABLE * scale + 50) / 100)
    table[table == 0] = 1  # prevent division by zero
    return table

def dct2(a):
    return dct(dct(a.T, norm='ortho').T, norm='ortho')

def idct2(a):
    return idct(idct(a.T, norm='ortho').T, norm='ortho')

def process_block(block, q_table):
    # Shift values to [-128, 127]
    block_shifted = block.astype(np.float32) - 128
    
    # Forward DCT
    dct_block = dct2(block_shifted)
    
    # Quantization
    quantized_block = np.round(dct_block / q_table)
    
    # Dequantization
    dequantized_block = quantized_block * q_table
    
    # Inverse DCT
    idct_block = idct2(dequantized_block)
    
    # Shift back and clip
    result_block = np.clip(idct_block + 128, 0, 255).astype(np.uint8)
    
    return result_block, quantized_block

def compress_image_to_blocks(image_np, quality):
    """
    Processes the image block by block and returns a list of block data.
    """
    h, w = image_np.shape[:2]
    # Pad image to be multiple of 8
    pad_h = (8 - h % 8) % 8
    pad_w = (8 - w % 8) % 8
    img_padded = np.pad(image_np, ((0, pad_h), (0, pad_w)), mode='edge')
    
    h_new, w_new = img_padded.shape
    q_table = get_quantization_table(quality)
    
    blocks_data = []
    
    for i in range(0, h_new, 8):
        for j in range(0, w_new, 8):
            original_block = img_padded[i:i+8, j:j+8]
            processed_block, quantized = process_block(original_block, q_table)
            
            blocks_data.append({
                "row": i,
                "col": j,
                "original": original_block.tolist(),
                "processed": processed_block.tolist(),
                # We can also send some info about the quantized block like non-zero count
                "non_zero_count": int(np.count_nonzero(quantized))
            })
            
    return blocks_data, h_new, w_new, q_table.tolist()
