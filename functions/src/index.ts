/**
 * @file Initialize Firebase Admin SDK.
 */
import * as admin from "firebase-admin";
admin.initializeApp();

import {saveFormData} from "./callable/SaveFormData";
import {webhookHandler} from "./https/SubscriptionStatusHandler";
import {cleanUpAndTransformData} from "./https/LanguageCleanup";
import {batchUpload} from "./https/BatchUpload";
import {handleDuplicates} from "./https/RemoveDuplicates";
import {getRegistrationData} from "./https/GetRegistrationData";
import {getDemographicData} from "./https/GetDemographicData";

export {
  saveFormData,
  webhookHandler,
  cleanUpAndTransformData,
  batchUpload,
  handleDuplicates,
  getRegistrationData,
  getDemographicData,
};
