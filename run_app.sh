#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "Stopping application..."
    # Disable traps to prevent infinite recursion
    trap - SIGINT SIGTERM
    
    # Kill background PIDs specifically to be safe
    if [ ! -z "$BACKEND_PID" ]; then kill $BACKEND_PID 2>/dev/null; fi
    if [ ! -z "$FRONTEND_PID" ]; then kill $FRONTEND_PID 2>/dev/null; fi
    
    # Optional: ensure any remaining processes in the group are handled
    # kill -TERM -$$ 2>/dev/null
    
    exit 0
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "Starting JPEG Compression Explainer App..."

# Check if frontend dependencies are installed
if [ ! -d "jpeg-front/node_modules" ]; then
    echo "Warning: jpeg-front/node_modules not found. You might need to run 'npm install' in jpeg-front/ first."
fi

# 1. Start the Backend
echo "Starting FastAPI backend on port 8000..."
cd jpeg-back
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Start the Frontend
echo "Starting React frontend..."
cd jpeg-front
npm run dev &
FRONTEND_PID=$!
cd ..

echo "------------------------------------------------"
echo "Backend running at: http://localhost:8000"
echo "Frontend running at: http://localhost:5173"
echo "------------------------------------------------"
echo "Press Ctrl+C to stop both servers."

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
