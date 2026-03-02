#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "Stopping production server..."
    # Disable traps to prevent infinite recursion
    trap - SIGINT SIGTERM
    
    if [ ! -z "$SERVER_PID" ]; then kill $SERVER_PID 2>/dev/null; fi
    
    exit 0
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting JPEG Compression Explainer (PRODUCTION MODE)..."
echo "------------------------------------------------"
echo "Serving app on: http://localhost:8000"
echo "------------------------------------------------"

cd jpeg-back
uvicorn main:app --host 0.0.0.0 --port 8000
SERVER_PID=$!
cd ..

wait
