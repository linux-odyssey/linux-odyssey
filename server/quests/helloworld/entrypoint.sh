#!/bin/bash

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
#if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
#    . /etc/bash_completion
#fi

# This function will be called before each command is executed
preexec() {
    [ -n "$COMP_LINE" ] && return  # do nothing if completing
    [ "$BASH_COMMAND" = "$PROMPT_COMMAND" ] && return # do nothing if completing
    local command="$BASH_COMMAND"
    local pwd="$PWD"
    
    # Store command in variable
    local cmd=$(printf '{"token": "%s", "pwd": "%s", "command": "%s"}' "$TOKEN" "$pwd" "$command")
    
    # Send command to the API
    curl -X POST $API_ENDPOINT/api/v1/commands -H 'accept: */*' -H 'Content-Type: application/json' -d "$cmd"
}

# Install the trap
trap 'preexec' DEBUG
