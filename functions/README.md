# Boston Family Days Backend Application Cloud Functions

Firebase uses serverless cloud functions for cloud native code execution and backend logic.
There are two types of cloud functions:

1. Callable functions - functions that are called by cloud native services such as hosted applications using firebase
hosting, other cloud functions or other services.

2. Http trigger functions - functions that act as api endpoints and are usually called from external applications.

Boston Family Days includes the following required (v2/gen2/cloud run) cloud functions:

## Environment Variables

- REGION: us-central1
- PROJECT_ID (DEV): family-cultural-pass--dev
- PROJECT_ID (PROD): boston-family-days---prod
- STORAGE_BUCKET (DEV): bfd-student-data
- STORAGE_BUCKET (PROD): bfd-student-data-prod

## Callable functions:
### - SaveFileData (/saveFileData)

This function is used in the frontend application upload form which is a internal but public route used
for school administrators to securely upload csv student data for a two-step batch registration. This function is 
responsible for the first step of the two-step process which is to upload the student data to the storage bucket.
It returns data to the frontend application including a generated uuid which project administrators can use to
retrieve the data for vetting and proceeding to the second step of the process.

See [Batch Upload Formatting](https://docs.google.com/spreadsheets/d/1r3r9Jaqr3KyZccCGKaenbs2p6fYXjaVvHsw5rNH4eMU/edit?usp=sharing)
for the internal facing format requirements for the uploaded files.

The below fields are required:
- School
- FirstName
- LastName
- ContactName
- ContactEmail

And the following fields are optional:
- StudentNo
- ContactPhone
- DateOfBirth
- Grade
- ZipCode
- IsEnglishLearner
- HasIEP
- Neighborhood

The 1 or more (n larger than 10MB or exceed 10 files) csv file(s) must be well formed and follow the above requirements.

### - SaveFormData (/saveFormData)

This function is used in the frontend application multi-step form which is the main functionality for users to
individually self-register their children for the program. It handles one student at a time.

## Http trigger functions:
### - BatchUpload (/batchUpload?folderName=\<FOLDER_NAME>)
  - FOLDER_NAME is the name of the folder in the storage bucket to upload the files to.

  This endpoint is called via external client (e.g. curl) to trigger the second stage of the batch upload process
  which is to clean up the data and transform it into the system of record format given the folder name of the uploaded files
  via the saveFileData function.

  ```
  curl -X POST "https://<REGION>-<PROJECT_ID>.cloudfunctions.net/batchUpload?folderName=<FOLDER_NAME>" \
     -H "Authorization: Bearer <API_TOKEN>
  ```

### - GetDemographicData (/getDemographicData)

  This endpoint is used by CIVIS to export all the demographic data in a JSON object securely. It has strict IP limiting.

  ```
  curl -X GET "https://<REGION>-<PROJECT_ID>.cloudfunctions.net/getDemographicData" \
     -H "Authorization: Bearer <API_TOKEN>
  ```

### - GetRegistrationData (/getRegistrationData)
    
  This endpoint is used by the frontend application to get the registration data for a given student. It has strict IP limiting.

  ```
  curl -X GET "https://<REGION>-<PROJECT_ID>.cloudfunctions.net/getRegistrationData" \
     -H "Authorization: Bearer <API_TOKEN>"
  ```

### - SubscriptionStatusHandler (/subscriptionStatusHandler)

  This endpoint is provided to upaknee as a webhook to update the subscription status for a given student asynchronously. This is a public endpoint with no authentication.

### - SyncUpaknee (/syncUpaknee)

   This endpoint is provided to external clients to sync the student data with the upaknee email service in case we need a complete sync. 
   Warning: this may take more than 15 minutes to complete.

   ```
   curl -X POST "https://<REGION>-<PROJECT_ID>.cloudfunctions.net/syncUpaknee" \
     -H "Authorization: Bearer <API_TOKEN>
   ```


