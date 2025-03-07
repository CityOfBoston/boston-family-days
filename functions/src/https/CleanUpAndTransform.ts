import {createHttpTrigger} from "../lib/functionsClient";
import {registrationDataRef,
  // demographicDataRef,
} from "../lib/firestoreClient";

/* This function is used for temporary batch clean ups
 * for the registration and demographic data collections in Firestore
 * It is a more secure and maintainable alternative to setting up firebase sdk
 * The specific logic and use case varies according to the needs at each stage
*/
export const cleanUpAndTransform = createHttpTrigger(
  "private",
  async (req, res) => {
    console.log("CleanUpAndTransform function started.");

    try {
      const registrationData = await registrationDataRef.get();
      // const demographicData = await demographicDataRef.get();

      // TODO: Go through registrationData and check if the status is not active
      // If not active, change to active. Don't update any other fields.
      // If active, do nothing.
      // Log the number of updates made.

      const batch = registrationDataRef.firestore.batch();
      let updateCount = 0;

      registrationData.forEach((doc) => {
        const data = doc.data();
        if (data.status !== "active") {
          batch.update(doc.ref, {status: "active"});
          updateCount++;
        }
      });

      await batch.commit();

      res.status(200).send(`Data cleaned and transformed 
        successfully. Estimated updates: ${updateCount}`);
    } catch (error) {
      console.error("Error in CleanUpAndTransform function:", error);
      res.status(500).send("An error occurred during the update process.");
    }
  }
);
