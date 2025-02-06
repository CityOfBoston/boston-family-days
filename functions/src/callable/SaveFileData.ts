import * as functions from "firebase-functions";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {nanoid} from "nanoid";

// Get a reference to the Cloud Storage bucket
const bucket = admin.storage()
  .bucket(process.env.FILE_UPLOAD_BUCKET!);

// Rate limiting configuration
const MAX_CALLS_PER_MINUTE = 5;
const MAX_CALLS_PER_DAY = 50;

// Maximum allowed file size in bytes (adjust as needed)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileData {
  name: string;
  data: string;
}

interface SuccessResponse {
  id: string;
}

interface ErrorResponse {
  error: string;
}

type UploadResponse = SuccessResponse |
ErrorResponse;

export const saveFileData = onCall(
  async (
    request: functions.https.CallableRequest<{
      title: string;
      description: string;
      files: FileData[];
    }>
  ): Promise<UploadResponse> => {
    // --- Global Rate Limiting ---
    const rateLimitRef = admin
      .firestore()
      .collection("batchUploadData")
      .doc("globalLimit"); // Use a single document for global limit

    const now = new Date();
    const currentMinute =
    Math.floor(now.getTime() / (60 * 1000));
    const today = new Date(now.getFullYear(),
      now.getMonth(), now.getDate());

    try {
      await admin.firestore().runTransaction(
        async (transaction) => {
          const rateLimitDoc = await
          transaction.get(rateLimitRef);
          let callsThisMinute = 0;
          let callsToday = 0;

          if (rateLimitDoc.exists) {
            const lastMinute = rateLimitDoc.
              get("lastMinute");
            const lastReset = rateLimitDoc.
              get("lastReset")?.toDate();

            if (lastMinute === currentMinute) {
              callsThisMinute = rateLimitDoc.
                get("countPerMinute") || 0;
            }

            if (!lastReset || lastReset < today) {
              callsToday = 1;
            } else {
              callsToday = rateLimitDoc.get("countPerDay") || 0;
            }
          } else {
            callsToday = 1;
          }

          if (
            callsThisMinute >=
          MAX_CALLS_PER_MINUTE ||
          callsToday >= MAX_CALLS_PER_DAY
          ) {
            throw new HttpsError(
              "resource-exhausted",
              "Rate limit exceeded."
            );
          }

          transaction.set(
            rateLimitRef,
            {
              countPerMinute:
            (callsThisMinute || 0) + 1,
              lastMinute: currentMinute,
              countPerDay: callsToday + 1,
              lastReset: now,
            },
            {merge: true}
          );
        });
    } catch (error) {
      if (error instanceof
        HttpsError) {
        return {error: error.message};
      } else {
        console.error(
          "Error updating rate limit:", error);
        return {
          error: "Error processing request."};
      }
    }

    // --- File Size Check ---
    if (!request.data.files ||
        request.data.files.length === 0) {
      return {
        error: "No files provided."};
    }

    for (const file of request.data.files) {
      const fileSize = Buffer.byteLength(file.data, "base64");
      if (fileSize > MAX_FILE_SIZE) {
        return {
          error: `File ${file.name} 
          exceeds the maximum allowed size of ${
  MAX_FILE_SIZE / (1024 * 1024)
}MB.`,
        };
      }
    }

    // --- Generate UUID and Create Folder ---
    const folderId = nanoid();
    const folderPath = `${folderId}/`;

    // --- Save All Data in Firestore ---
    const batchDataRef = admin
      .firestore()
      .collection("batchUploadData")
      .doc(folderId);
    await batchDataRef.set({
      title: request.data.title,
      description: request.data.description,
      timestamp: now,
      // Include rate limiting data for this call
      rateLimit: {
        callsThisMinute:
          (await rateLimitRef.get())
            .get("countPerMinute") || 0,
        callsToday:
        (await rateLimitRef.get())
          .get("countPerDay") || 0,
      },
    });

    // --- Upload Files ---
    try {
      await Promise.all(
        request.data.files.map(async (file) => {
          const fileRef = bucket.file(
            `${folderPath}${file.name}`);
          await fileRef.save(file.data, {
            contentType: "text/csv",
          });
        })
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      return {error: `Error uploading files: ${error}`};
    }

    return {id: folderId};
  }
);
