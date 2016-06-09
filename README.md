# Slack Export Browser

You need to specify the channel name and a date upon which a conversation happened.

1. Copy contents of Slack's export into `export/`:

    cd /path/to/this/repo/ # i.e. ~/Documents/slack-export-browser

    cp -R /path/to/downloaded-export-from-slack/* ./export/


2. Install packages

`npm install`


3. Run static server

`http-server`


4. Done

Then visit `http://localhost:8080/`
