# drive-audio-rec

Records audio from google web app to folders in google drive.

## How it works

Each user is assigned a token. This is attatched to the end of the URL given to them with `[url]?token=[token]`. You assign this token manually and add it to the URL manually.

When the user visits the site, a folder is created in the drive folder you have specified (Master Folder). They are then shown an utterance loaded from `utteranceList.txt` in the master folder. They can record, rerecord, and listen back to their recordings before they submit. When they submit, the recording is saved to their folder and they are shown the next word in the utterance list.

The utterances are worked out based on what has been recorded, so the users (as long as they use the same link) can come back and record another time. When all recordings are done, the user is shown a message saying this.

## Setup

Create 2 properties in your app script project:
```
master_folder_id = [google drive master folder ID]
project_name = [your project name]
```

Deploy on google apps script as a web app, executing as yourself.