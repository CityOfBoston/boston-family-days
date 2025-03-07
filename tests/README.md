# Boston Family Days Function Testing Tool

This directory contains tools for testing the Boston Family Days cloud functions.

## Call Functions Script

The `call-functions.sh` script provides an interactive interface to call any of the HTTP trigger functions with proper credentials. It automatically loads the environment variables from the `../functions/.env` file and uses the `EXTERNAL_API_TOKEN` for authentication.

### Prerequisites

- Bash shell
- `curl` command-line tool
- Access to the Boston Family Days project
- Properly configured `../functions/.env` file with `EXTERNAL_API_TOKEN` and `FIREBASE_PROJECT_ID`

### Usage

Simply run the script without any arguments:

```bash
./call-functions.sh
```

The script will:
1. Display a menu of available functions
2. Prompt you to select a function
3. Ask for any required parameters (e.g., folder name for batchUpload)
4. Show a summary and ask for confirmation before executing
5. Execute the function with proper authentication
6. Ask if you want to call another function

### Available Functions

- `batchUpload` - Triggers the second stage of the batch upload process
  - Requires a folder name parameter
- `getDemographicData` - Exports all demographic data in a JSON object
- `getRegistrationData` - Gets registration data for students
- `syncUpaknee` - Syncs student data with the Upaknee email service
- `subscriptionStatusHandler` - Webhook for Upaknee to update subscription status
  - Requires email and status parameters

### Notes

- The script automatically determines the HTTP method based on the function and data:
  - `batchUpload` and `syncUpaknee` always use POST
  - Any function with data payload uses POST
  - All other functions use GET
- All functions except `subscriptionStatusHandler` require authentication with the `EXTERNAL_API_TOKEN`
- The script provides a confirmation step before executing any function
- You can run multiple functions in sequence without restarting the script 