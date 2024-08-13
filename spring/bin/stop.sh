#!/bin/bash

if [ -f app.pid ]; then
    PID=$(cat app.pid)
    echo "Stopping process with PID: $PID"
    kill $PID
    rm app.pid
else
    echo "No PID file found. Is the application running?"
fi
