# This function will be called before each command is executed
preexec() {
    [ -n "$COMP_LINE" ] && return  # do nothing if completing
    [ "$BASH_COMMAND" = "$PROMPT_COMMAND" ] && return # do nothing if completing
    export COMMAND="$BASH_COMMAND"

    if [[ $COMMAND =~ ^(vim|top|less|more|nano) ]]; then
        node /usr/local/bin/cli.js
        return
    fi

    # Execute the command, capture output and exit code
    export OUTPUT=$( { eval $COMMAND 2>&1; echo $? > /tmp/exit_code; }) 
    export EXIT_CODE=$(cat /tmp/exit_code)

    echo $OUTPUT
    # Send command to the API
    node /usr/local/bin/cli.js

    BASH_COMMAND=""
}

# Install the trap
trap 'preexec' DEBUG
