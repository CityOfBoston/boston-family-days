import * as admin from "firebase-admin";
import {onCall} from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

export const saveFormData = onCall(async () => {
  try {
    console.log("Starting Firestore write test...");

    // Insert a hardcoded value into the "testCollection"
    const testDoc = {
      testField: "Hello Firestore",
    };

    // Add document to Firestore and return a promise
    return db.collection("testCollection")
      .add(testDoc)
      .then((docRef) => {
        console.log("Document written with ID:", docRef.id);

        // Return a response to the client
        return {success: true,
          message: "Document added successfully",
          docId: docRef.id};
      })
      .catch((error) => {
        console.error("Error writing to Firestore:", error);
        throw new Error("Failed to write to Firestore");
      });
  } catch (error) {
    console.error("Unhandled error:", error);
    throw new Error("Function execution failed");
  }
});
