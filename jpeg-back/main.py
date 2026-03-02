from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import numpy as np
import cv2
import os
from process.compression import compress_image_to_blocks

app = FastAPI()

# Enable CORS for React frontend (during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoint
@app.post("/process")
async def process_image(file: UploadFile = File(...), quality: int = Form(50)):
    # Read image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    if img is None:
        return {"error": "Invalid image"}
    
    # Compress and get blocks
    blocks_data, h_new, w_new, q_table = compress_image_to_blocks(img, quality)
    
    # Calculate compressed size using real JPEG encoding
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    _, encimg = cv2.imencode('.jpg', img, encode_param)
    compressed_size = len(encimg)
    original_size = len(contents)
    
    return {
        "blocks": blocks_data,
        "h": h_new,
        "w": w_new,
        "q_table": q_table,
        "original_size": original_size,
        "compressed_size": compressed_size,
        "ratio": original_size / compressed_size if compressed_size > 0 else 0
    }

# Serve Static Frontend Files (if dist exists)
DIST_DIR = "../jpeg-front/dist"
if os.path.exists(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=f"{DIST_DIR}/assets"), name="assets")
    
    @app.get("/")
    async def serve_index():
        return FileResponse(f"{DIST_DIR}/index.html")
    
    @app.get("/{full_path:path}")
    async def serve_all(full_path: str):
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.exists(file_path):
            return FileResponse(file_path)
        return FileResponse(f"{DIST_DIR}/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
