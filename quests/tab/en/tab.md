# Using Tab Completion

In this quest, you will learn:

1. How to complete paths with Tab
2. How to handle multiple matching names

Click the button in the middle to start this quest.

---

In the terminal, you work by entering text.
Typing takes time, and a single typo can make a command fail.
Autocompletion helps you fill in file paths, command names, and supported options, saving time and avoiding typos.

Before we start practicing, let's see which files are in your home folder.

> Use `ls` to list the files

---

This folder is full of very long and misspelled filenames. Typing them character by character would be painful.
Luckily, autocompletion makes even long filenames easy to enter.

To use autocompletion, **type part of a filename, then press Tab**.
(Tab is the key to the left of Q.)
For example, type `Su` and press Tab to complete `SuperSecretPlansForWorldDomination.txt`. The terminal fills in the rest for you.

Let's display the contents of `SuperSecretPlansForWorldDomination.txt`.

> Use `cat SuperSecretPlansForWorldDomination.txt` to display the file contents
> Type `cat Su`, then press Tab to complete the filename. Press Enter to run the command

---

The terminal completed `SuperSecretPlansForWorldDomination.txt` for you, saving you from typing a long name and making mistakes.
You can start with `S`, `Su`, `Sup`, `Super`, or even no characters at all.
However, the fewer characters you enter, the more likely they are to match several files.
We will practice handling multiple matches shortly.

Autocompletion also helps with awkward spellings. Take `ThsisAFlieNmaeWthAloOfTpyosThatisRleayHdToRaed.txt`: anyone could make a mistake typing that!
Use `cat` again to display the contents of `ThsisAFlieNmaeWthAloOfTpyosThatisRleayHdToRaed.txt`.

> Enter `cat ThsisAFlieNmaeWthAloOfTpyosThatisRleayHdToRaed.txt` to display the file contents
> Type `cat Thsi`, then press Tab to complete the filename
> Try pressing Tab after entering fewer characters and see what happens

---

You have opened the file with the misspelled name.
With autocompletion, typos, mixed capitalization, and random-looking names are much easier to handle.
Let's practice again. This time, list the files inside `ThingsIWillOrganizeLaterWhenIHaveTime`.
As before, type the first few characters, then press Tab.

> Enter `ls ThingsIWillOrganizeLaterWhenIHaveTime` to list the files inside the folder
> Type `ls Thing`, then press Tab to complete the folder name

---

This folder contains three files: a guide to making sandwiches and two lists of things downloaded in the middle of the night.
The sandwich guide, `HowToProperlyMakeASandwich.txt`, is inside another folder, so one press of Tab will not complete the whole path.
This time, let's practice **completing a path in steps**.

Type the start of the folder name and press Tab. Then type the start of the filename and press Tab again to complete `folder/filename`.
When you complete a folder name, the terminal adds `/` at the end for you.
Let's open `HowToProperlyMakeASandwich.txt`.

> Enter `cat ThingsIWillOrganizeLaterWhenIHaveTime/HowToProperlyMakeASandwich.txt` to display the file contents
> Type `cat Thin`, then press Tab to complete it to `cat ThingsIWillOrganizeLaterWhenIHaveTime/`
> Next, type `How` after the folder path and press Tab to complete the full path

---

You have read this very strict guide to making a sandwich.
Two files remain: `RandomStuffThatIDownloadedAt3AM.txt` and `RandomStuffThatIDownloadedAt4AM.txt`.
Their names are almost identical. They differ only at `3AM` and `4AM` before the `.txt` extension.
If you only type the first few characters, the terminal cannot tell which file you want.
This is a case of **multiple matches**.

You can handle multiple matches in steps, just as you did with the folder path.
Type `Ran` and press Tab. The terminal completes the shared part of both names: `RandomStuffThatIDownloadedAt`.
Then type `3` or `4`, depending on which file you want, and press Tab again to complete the rest.

_Completing a full path also takes steps: after completing the folder name, you still need to choose a file inside it._

> Enter `cat ThingsIWillOrganizeLaterWhenIHaveTime/RandomStuffThatIDownloadedAt3AM.txt` to display the file contents
> Type `cat Thin`, then press Tab to complete it to `cat ThingsIWillOrganizeLaterWhenIHaveTime/`
> Next, type `Ran` and press Tab to complete it to `cat ThingsIWillOrganizeLaterWhenIHaveTime/RandomStuffThatIDownloadedAt`
> Then type `3` and press Tab to complete the full path.

---

You have read a list of things downloaded at 3 AM. Hmm... that is enough internet for today.
Here is a final challenge: enter `ThingsIWillOrganizeLaterWhenIHaveTime`, then display the contents of `RandomStuffThatIDownloadedAt4AM.txt`.
Use the autocompletion skills you learned today to complete the task.
