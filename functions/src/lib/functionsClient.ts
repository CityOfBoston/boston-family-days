import * as functions from "firebase-functions/v2";
import {addStudentToFirebase,
  updateProfileId,
  syncSubscribers} from "./firestoreClient";
import {StudentRegistrationData, StudentSubscriberData} from "./types";
import {addSingleSubscriber} from "./upakneeClient";
import {Request, Response} from "express";
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

/**
 * Utility function to create HTTP trigger functions with
 * different access levels. Public endpoints are not protected
 * and can be accessed by anyone. Protected endpoints
 * require a valid API key while private endpoints require
 * both a valid API key and a valid IP address.
 * @param {string} accessLevel - The access level of the function.
 * @param {any} handler
 * - The handler function for the function.
 * @param {boolean} hasBatchOperation
 * - Whether the function has a batch operation.
 * @return {functions.https.onRequest}
 */
export function createHttpTrigger(
  accessLevel: "public" | "protected" | "private" = "protected",
  handler: (request: functions.https.Request, response: Response)
    => void | Promise<void>,
  hasBatchOperation = false) {
  return functions.https.onRequest(
    hasBatchOperation ?
      {timeoutSeconds: 1800} :
      {timeoutSeconds: 300},
    async (req, res) => {
      try {
        if (accessLevel === "protected" || accessLevel === "private") {
          await validateIpAddress(req, res);
        }
        if (accessLevel === "private") {
          await validateApiKey(req, res);
        }
        handler(req, res);
      } catch (error) {
        console.error(`Error in ${accessLevel} function:`, error);
        res.status(500).send(
          "Terminated on error, see logs for details.");
      }
    });
}

const secretManagerClient = new SecretManagerServiceClient();

/**
 * Given a firebase cloud function request, it will check the
 * request IP
 * address and determine if it is allowed.
 * @param {Request} request - The request object.
 * @param {Response} res - The response object.
 */
const validateIpAddress = async (request: Request, res: Response) => {
  const clientIp = request.headers["x-forwarded-for"] ||
        request.connection.remoteAddress || "";
  const [version] = await secretManagerClient.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}` +
    "/secrets/IP_WHITELIST/versions/latest",
  });
  const allowedIPs = version.payload?.data?.toString().
    split(",").map((ip: string) => ip.trim());
  if (!allowedIPs?.some((allowedIp: string) =>
    (clientIp as string).startsWith(allowedIp.split("/")[0]))) {
    res.status(403).json(
      {error: "Access denied: IP not allowed"});
    return;
  }
};

/**
 * Given a firebase cloud function request, it will check the provided
 * API key and determine if it is valid by fetching the API key from
 * GCP Secret Manager.`
 * @param {Request} request - The request object.
 * @param {Response} res - The response object.
 */
const validateApiKey = async (request: Request, res: Response) => {
  const authHeader = request.headers.authorization || "";
  const token = authHeader.split(" ")[1];
  const [version] = await secretManagerClient.accessSecretVersion({
    name: `projects/${process.env.GCP_PROJECT_ID}`+
    "/secrets/EXTERNAL_API_TOKEN/versions/latest",
  });
  const externalAPIToken = version.payload?.data?.toString();
  if (token !== externalAPIToken) {
    res.status(401).json({error: "Unauthorized API key"});
    return;
  }
};

/**
 * Adds a student to Firebase and, if applicable,
 * adds them as a subscriber to Upaknee.
 * Updates the Firestore collection with
 * the profile ID from Upaknee.
 * @param {StudentRegistrationData} studentRegistrationData
 * - The student registration data.
 * @return {Promise<{studentIndex: number,
 * status: string, passId: string}>}
 * An object containing the studentIndex, status, and passId.
 */
export const addStudentAndUpdateSubscriber = async (
  studentRegistrationData: StudentRegistrationData
): Promise<{studentIndex: number,
  status: string, passId: string}> => {
  console.log("Adding student and updating subscriber",
    studentRegistrationData);
  // Step 1: Add student to Firebase
  const {studentIndex, status, passId} =
  await addStudentToFirebase(studentRegistrationData);

  // Step 2: Check status and add to Upaknee if applicable
  if (status !== "duplicate" && status !== "n/a") {
    try {
      const subscriber: StudentSubscriberData = {
        passId: passId,
        firstName: studentRegistrationData.firstName,
        lastName: studentRegistrationData.lastName,
        school: studentRegistrationData.school,
      };

      const profileId = await addSingleSubscriber(
        subscriber,
        studentRegistrationData.email,
        studentIndex
      ); // Explicit Confirmation

      console.log("Added subscriber to Upaknee", subscriber);

      // Step 3: Update Firestore with the profile ID
      await updateProfileId(passId, profileId);
    } catch (error) {
      console.error("Failed to add subscriber to Upaknee:", error);
      throw new Error("Failed to add subscriber to Upaknee.");
    }
  } else {
    if (status === "duplicate") {
      console.log("Student already exists.");
    } else if (status === "n/a") {
      console.log("Student index exceeds limit.");
    }
    console.log("Skipping subscriber addition for student with status",
      status, "and passId", passId);
  }

  return {studentIndex, status, passId};
};

/**
 * Adds a list of students to Firebase and syncs them with Upaknee.
 * @param {StudentRegistrationData[]} studentRegistrationDataList
 * - A list of student registration data.
 * @return {Promise<void>}
 * A promise that resolves when the operation is complete.
 */
export const addStudentsAndSyncSubscribers = async (
  studentRegistrationDataList: StudentRegistrationData[]
): Promise<void> => {
  console.log("Adding students to Firebase");
  // Add students to Firestore
  for (const studentRegistrationData of studentRegistrationDataList) {
    await addStudentAndUpdateSubscriber(studentRegistrationData);
  }
  // Sync subscribers with Upaknee
  await syncSubscribers();
};

/**
 * Validates the 'limit' query parameter.
 * Returns a valid number if the input is a valid positive integer.
 * Returns the default limit if the input is undefined or empty.
 * Returns null if the input is not a valid positive integer.
 * @param {string | undefined} limitInput
 * - The input string representing the limit.
 * @return {number | null}
 * - The validated limit number or null if invalid.
 */
export const validateLimit = (limitInput?: string): number | null => {
  if (!limitInput) {
    return 100; // Return default if no input is provided.
  }
  const limit = parseInt(limitInput, 10);
  if (isNaN(limit) || limit <= 0) {
    return null; // Return null for invalid numbers.
  }
  return limit; // Return the parsed number if valid.
};
