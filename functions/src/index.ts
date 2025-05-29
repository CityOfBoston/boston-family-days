/**
 * @file Initialize Firebase Admin SDK.
 */
import * as admin from "firebase-admin";

admin.initializeApp();

import {saveFormData} from "./callable/SaveFormData";
import {saveFileData} from "./callable/SaveFileData";
import {webhookHandler} from "./https/SubscriptionStatusHandler";
import {cleanUpAndTransform} from "./https/CleanUpAndTransform";
import {batchUpload} from "./https/BatchUpload";
import {getRegistrationData} from "./https/GetRegistrationData";
import {getDemographicData} from "./https/GetDemographicData";
import {syncUpaknee} from "./https/SyncUpaknee";
import {getWalletPass} from "./https/GetWalletPass";
import {activatePending} from "./https/activatePending";

export {
  saveFormData,
  saveFileData,
  webhookHandler,
  cleanUpAndTransform,
  batchUpload,
  getRegistrationData,
  getDemographicData,
  syncUpaknee,
  getWalletPass,
  activatePending,
};
