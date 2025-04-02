import requests, os
from dotenv import load_dotenv

load_dotenv()

# Define constants
PROJECT_ID = os.getenv("PROJECT_ID")
REGION = os.getenv("REGION")
API_TOKEN = os.getenv("API_TOKEN")

# Define endpoints
REGISTRATION_DATA_URL = f"https://{REGION}-{PROJECT_ID}.cloudfunctions.net/getRegistrationData"
DEMOGRAPHIC_DATA_URL = f"https://{REGION}-{PROJECT_ID}.cloudfunctions.net/getDemographicData"

# Headers with API token for authentication
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

def fetch_all_data(url):
    """Fetches all data from the given URL, handling pagination."""
    all_data = []
    page_token = None

    while True:
        params = {"limit": 200}  # Adjust batch size as needed
        if page_token:
            params["pageToken"] = page_token

        response = requests.get(url, headers=HEADERS, params=params)

        if response.status_code != 200:
            print(f"Error fetching data from {url}: {response.status_code} - {response.text}")
            break

        data = response.json()
        all_data.extend(data.get("bookings", []))  # Adjust key based on endpoint response format

        # Check for next page
        page_token = data.get("nextPageToken")
        if not page_token:
            print(f"No more pages to fetch from {url}")
            break

    return all_data

registration_data = fetch_all_data(REGISTRATION_DATA_URL)
demographic_data = fetch_all_data(DEMOGRAPHIC_DATA_URL)