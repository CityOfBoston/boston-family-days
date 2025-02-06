
## Example Add Subscriber
```
curl -X POST https://us-central1-family-cultural-pass--dev.cloudfunctions.net/addSubscriber \
-H "Content-Type: application/json" \
-d '{
    "email": "hongkang.xu@boston.gov",
    "firstName": "Kane",
    "lastName": "Xu",
    "newsletterId": "nws_id_50",
    "embeddedData": "ID: H8X9L"
}'
```

## Example Remove Subscriber
```
curl -X POST https://us-central1-family-cultural-pass--dev.cloudfunctions.net/deleteSubscriber \
-H "Content-Type: application/json" \
-d '{
    "profileId": "[ID]",
    "newsletterId": "nws_id_50"
}'
```

curl -X POST https://us-central1-family-cultural-pass--dev.cloudfunctions.net/cleanUpAndBackfill


curl -X GET \
  -H "x-api-key: 6691f02d-3376-415d-b1d8-74d6941bcfcd" \
  "https://us-central1-family-cultural-pass--dev.cloudfunctions.net/getRegistrationData?limit=10"

curl -X GET \
  -H "x-api-key: aec8d1f3-d1c9-4ffe-9bc6-51939d971e9b" \
  "https://us-central1-boston-family-days---prod.cloudfunctions.net/getRegistrationData"
