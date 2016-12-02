# member-manager

Take a spreadsheet of user info, convert to JSON for parsing/data manipulation/grabbing geocoding data, and convert back to CSV.

### Requirements

- Node + npm ([Download](https://nodejs.org/en/download/))
- Gulp CLI ([Installation instructions](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md))

### Setup

- Download the project folder
- Run `npm install` in the project directory

### Usage
- Download a member list CSV, name it `master.csv` and put it in the `source` directory
- Create a file called `callers.json` in the project directory with a list of emails of people who want to do phonebanking, contents formatted as JSON (e.g. `["test1@email.com","test2@email.com"]`)
- Run `gulp convert` in a command-line interface from  project directory
- Run `gulp get-info` until there are no more messages to run that command again in the CLI (will probably get rate-limited by the geocoding API)
- Run `gulp create-csv` to create `cleaned.csv` in the `complete` directory