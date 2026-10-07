# Running Executable Files

## Outline

1. What an executable file is
2. How to find an executable with `which`
3. How to run an executable file

---

In earlier lessons, you used commands such as `ls`, `cat`, `cp`, `mv`, and `rm`.
These commands are **executable files** that the operating system runs when you enter them.
For most commands, you can find the corresponding file in the file system.
Use `which` to find the file associated with a command.
Enter `which [command name]` to display its path.

> Use `which ls` to find the path to `ls`

---

The terminal displays `/usr/bin/ls`, the location of the `ls` executable.
`/usr/bin` is a system folder containing many standard programs, including commands such as `cat` and `cp`.

> Use `which cat` to find the path to `cat`

---

To run an executable file, enter its path directly.
Let's try running a command using the path to its executable.

> Enter `/usr/bin/ls` to list the contents of your current folder

---

It lists the files in your folder, just as entering `ls` does. You can compare the results yourself.
You can still pass arguments. Let's try this with `cat`.

> Enter `/usr/bin/cat hello.txt` to display the contents of `hello.txt`

---

You can see the contents of `hello.txt`, just as you would with `cat`.
This makes sense: `cat` is located at `/usr/bin/cat`, so both commands run the same program.
A command like this consists of **an executable** plus **arguments**.
You can enter `ls` instead of `/usr/bin/ls` because the `PATH` environment variable tells the terminal which *folders* to search for programs.
`PATH` and environment variables are beyond this lesson's scope. We will cover them in a future lesson.

You can also run custom programs, such as the `dog` file in your current folder.

> Use `cat dog` to display the contents of `dog`

---

This is a simple program built from `echo` and `sleep` commands.
You do not need to understand every detail yet. It prints a few lines of text, with short pauses between them.

To run a file, specify its path.
Since `dog` is in your home folder, its absolute path is `/home/commander/dog`. You can also use the shorter form `~/dog`.

> Enter `~/dog` to run the `dog` file

---

The terminal displays a few words from this dog with an attitude.
When you are in the same folder as a program, a relative path is often more convenient than an absolute path.
To run a program in your current folder, put `./` before its filename instead of entering just its name.
In a path, `.` means the current folder.
Now try running `dog` using a relative path.

> Enter `./dog` to run the `dog` file

---

The dog produces the same output as before.
This is an example of a simple custom command.
You can put a sequence of commands in a file and run them together to handle complex or repetitive tasks.
This technique is also useful when running programs written by other people.

Here is a final challenge: enter the `commands` folder, then run the `lucky` file inside it using a relative path.
