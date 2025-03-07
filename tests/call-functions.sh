#!/bin/bash

# Script to call Boston Family Days HTTP trigger functions with proper credentials
# This script allows users to call any of the available HTTP functions with the proper authentication

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f "../functions/.env" ]; then
  source "../functions/.env"
  echo -e "${GREEN}Loaded environment variables from ../functions/.env${NC}"
else
  echo -e "${RED}Error: ../functions/.env file not found${NC}"
  exit 1
fi

# Check if EXTERNAL_API_TOKEN is set
if [ -z "$EXTERNAL_API_TOKEN" ]; then
  echo -e "${RED}Error: EXTERNAL_API_TOKEN is not set in the .env file${NC}"
  exit 1
fi

# Default region
REGION="us-central1"

# Default project ID from environment variable - use FB_PROJECT_ID instead of GCP_PROJECT_ID
PROJECT_ID="$FB_PROJECT_ID"

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}Error: FB_PROJECT_ID is not set in the .env file${NC}"
  exit 1
fi

# Available functions
FUNCTIONS=(
  "batchUpload"
  "cleanUpAndTransform"
  "getDemographicData"
  "getRegistrationData"
  "syncUpaknee"
  "subscriptionStatusHandler"
)

# Function descriptions
declare -A FUNCTION_DESCRIPTIONS
FUNCTION_DESCRIPTIONS["batchUpload"]="Triggers the second stage of the batch upload process"
FUNCTION_DESCRIPTIONS["cleanUpAndTransform"]="Cleans up and transforms the registration data"
FUNCTION_DESCRIPTIONS["getDemographicData"]="Exports all demographic data in a JSON object"
FUNCTION_DESCRIPTIONS["getRegistrationData"]="Gets registration data for students"
FUNCTION_DESCRIPTIONS["syncUpaknee"]="Syncs student data with the Upaknee email service"
FUNCTION_DESCRIPTIONS["subscriptionStatusHandler"]="Webhook for Upaknee to update subscription status"

# Function to display the menu and get user selection
function display_menu {
  echo -e "${BLUE}=== Boston Family Days Function Testing Tool ===${NC}"
  echo -e "${BLUE}Select a function to call:${NC}"
  echo
  
  for i in "${!FUNCTIONS[@]}"; do
    echo -e "  ${GREEN}$((i+1))${NC}. ${YELLOW}${FUNCTIONS[$i]}${NC} - ${FUNCTION_DESCRIPTIONS[${FUNCTIONS[$i]}]}"
  done
  
  echo -e "  ${GREEN}0${NC}. Exit"
  echo
  
  read -p "Enter your choice [0-${#FUNCTIONS[@]}]: " choice
  
  if [[ "$choice" =~ ^[0-9]+$ ]]; then
    if [ "$choice" -eq 0 ]; then
      echo -e "${BLUE}Exiting...${NC}"
      exit 0
    elif [ "$choice" -ge 1 ] && [ "$choice" -le "${#FUNCTIONS[@]}" ]; then
      FUNCTION="${FUNCTIONS[$((choice-1))]}"
      return 0
    fi
  fi
  
  echo -e "${RED}Invalid choice. Please try again.${NC}"
  return 1
}

# Function to get query parameters for a function
function get_query_params {
  local function_name="$1"
  QUERY_PARAMS=()
  
  case "$function_name" in
    "batchUpload")
      read -p "Enter folder name: " folder_name
      if [ -n "$folder_name" ]; then
        QUERY_PARAMS+=("folderName=$folder_name")
      else
        echo -e "${RED}Folder name is required for batchUpload function.${NC}"
        return 1
      fi
      ;;
    *)
      # No query parameters needed for other functions
      ;;
  esac
  
  return 0
}

# Function to get data payload for a function
function get_data_payload {
  local function_name="$1"
  DATA=""
  
  case "$function_name" in
    "subscriptionStatusHandler")
      read -p "Enter email address: " email
      read -p "Enter status (subscribed/unsubscribed): " status
      
      if [ -n "$email" ] && [ -n "$status" ]; then
        DATA="{\"email\":\"$email\",\"status\":\"$status\"}"
      else
        echo -e "${RED}Email and status are required for subscriptionStatusHandler function.${NC}"
        return 1
      fi
      ;;
    *)
      # No data payload needed for other functions
      ;;
  esac
  
  return 0
}

# Function to confirm the execution
function confirm_execution {
  local function_name="$1"
  local url="$2"
  local method="$3"
  local data="$4"
  
  echo
  echo -e "${BLUE}=== Execution Summary ===${NC}"
  echo -e "${YELLOW}Function:${NC} $function_name"
  echo -e "${YELLOW}URL:${NC} $url"
  echo -e "${YELLOW}Method:${NC} $method"
  
  if [ -n "$data" ]; then
    echo -e "${YELLOW}Data:${NC} $data"
  fi
  
  echo
  read -p "Do you want to proceed? (y/n): " confirm
  
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    return 0
  else
    echo -e "${BLUE}Operation cancelled.${NC}"
    return 1
  fi
}

# Main execution loop
while true; do
  # Display menu and get user selection
  until display_menu; do
    : # Keep trying until a valid selection is made
  done
  
  echo -e "${BLUE}Selected function: ${YELLOW}$FUNCTION${NC} - ${FUNCTION_DESCRIPTIONS[$FUNCTION]}"
  
  # Get query parameters if needed
  until get_query_params "$FUNCTION"; do
    : # Keep trying until valid parameters are provided
  done
  
  # Get data payload if needed
  until get_data_payload "$FUNCTION"; do
    : # Keep trying until valid data is provided
  done
  
  # Build the URL with query parameters
  URL="https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION}"
  
  # Add query parameters if provided
  if [ ${#QUERY_PARAMS[@]} -gt 0 ]; then
    URL="${URL}?"
    for param in "${QUERY_PARAMS[@]}"; do
      URL="${URL}${param}&"
    done
    # Remove the trailing &
    URL="${URL%&}"
  fi
  
  # Determine HTTP method based on function and data
  METHOD="GET"
  if [ "$FUNCTION" == "batchUpload" ] || [ "$FUNCTION" == "syncUpaknee" ] || [ -n "$DATA" ]; then
    METHOD="POST"
  fi
  
  # Confirm execution
  if confirm_execution "$FUNCTION" "$URL" "$METHOD" "$DATA"; then
    echo -e "${YELLOW}Executing function...${NC}"
    
    if [ "$FUNCTION" == "subscriptionStatusHandler" ]; then
      # subscriptionStatusHandler is a public endpoint with no authentication
      if [ -n "$DATA" ]; then
        echo -e "${YELLOW}Sending POST request without authentication...${NC}"
        curl -X POST "$URL" \
          -H "Content-Type: application/json" \
          -d "$DATA" \
          -v
      else
        echo -e "${RED}Error: subscriptionStatusHandler requires data payload${NC}"
      fi
    else
      # All other functions require authentication
      if [ "$METHOD" == "POST" ]; then
        if [ -n "$DATA" ]; then
          echo -e "${YELLOW}Sending POST request with authentication and data...${NC}"
          curl -X POST "$URL" \
            -H "Authorization: Bearer ${EXTERNAL_API_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "$DATA" \
            -v
        else
          echo -e "${YELLOW}Sending POST request with authentication...${NC}"
          curl -X POST "$URL" \
            -H "Authorization: Bearer ${EXTERNAL_API_TOKEN}" \
            -v
        fi
      else
        echo -e "${YELLOW}Sending GET request with authentication...${NC}"
        curl -X GET "$URL" \
          -H "Authorization: Bearer ${EXTERNAL_API_TOKEN}" \
          -v
      fi
    fi
    
    echo
    echo -e "${GREEN}Request completed${NC}"
  fi
  
  echo
  read -p "Do you want to call another function? (y/n): " another
  if [[ ! "$another" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Exiting...${NC}"
    break
  fi
  
  echo
done 