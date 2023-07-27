# This function will be called before each command is executed
preexec() {
    [ -n "$COMP_LINE" ] && return  # do nothing if completing
    [ "$BASH_COMMAND" = "$PROMPT_COMMAND" ] && return # do nothing if completing
    local command="$BASH_COMMAND"
    local pwd="$PWD"

    if [[ $command =~ ^(vim|top|less|more|nano) ]]; then
        local payload=$(printf '{"token": "%s", "pwd": "%s", "command": "%s"}' "$TOKEN" "$pwd" "$command")
        curl -X POST $API_ENDPOINT/api/v1/commands -H 'accept: */*' -H 'Content-Type: application/json' -d "$payload"
        return
    fi

    # Execute the command, capture output and exit code
    local output=$( { eval $command 2>&1; echo $? > /tmp/exit_code; }) 
    local exit_code=$(cat /tmp/exit_code)

    local output_esc=$(echo $output | jq -Rs .)

    # Store command in variable
    local payload=$(printf '{"token": "%s", "pwd": "%s", "command": "%s", "exit_code": "%s", "output": %s}' "$TOKEN" "$pwd" "$command" "$exit_code" "$output_esc")
    
    # Send command to the API
    curl -X POST $API_ENDPOINT/api/v1/commands -H 'accept: */*' -H 'Content-Type: application/json' -d "$payload" || echo $payload

    BASH_COMMAND=""
}

# Install the trap
trap 'preexec' DEBUG
