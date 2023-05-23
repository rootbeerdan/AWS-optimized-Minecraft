#!/bin/bash

# Run the command and store the output in a variable
output=$(netstat -atn | grep :25565 | grep ESTABLISHED | wc -l)

# Check if a shutdown is already scheduled
if [ -e "/run/systemd/shutdown/scheduled" ]; then
    shutdown_status=1
else
    shutdown_status=0
fi

# Check if the output is 0
if [ $output -eq 0 ]; then
    if [ $shutdown_status -eq 0 ]; then
        # Schedule a server shutdown in 15 minutes
        sudo shutdown -P +15
        echo "No active connections. Server will shut down in 15 minutes."
    else
        echo "No active connections, but a shutdown is already scheduled."
    fi
else
    if [ $shutdown_status -gt 0 ]; then
        # Cancel the pending shutdown
        sudo shutdown -c
        echo "Active connections found. Pending server shutdown canceled."
    else
        echo "Active connections found. No pending server shutdown."
    fi
fi
