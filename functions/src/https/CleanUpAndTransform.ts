import {createHttpTrigger} from "../lib/functionsClient";
import {registrationDataRef,
  demographicDataRef,
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
      const demographicData = await demographicDataRef.get();

      // TODO: Go through demographicData and check if the createdAt field
      // is present. If not, lookup the passId in registrationData and use
      // the createdAt field from registrationData. Update the demographicData
      // with the new createdAt field. If the lookup fails, log the entry with
      // a message then remove the entry from demographicData.

      const registrationDataMap = new Map();
      registrationData.forEach((doc) => {
        registrationDataMap.set(doc.id, doc.data().createdAt);
      });

      const batch = demographicDataRef.firestore.batch();
      let removalCount = 0;

      demographicData.forEach((doc) => {
        const data = doc.data();
        if (!data.createdAt) {
          const createdAt = registrationDataMap.get(data.passId);
          if (createdAt) {
            // Update the document with the createdAt field
            batch.update(doc.ref, {createdAt});
          } else {
            // Log and remove the document if createdAt cannot be found
            console.log(`Removing document: ${doc} due to missing createdAt`);
            batch.delete(doc.ref);
            removalCount++;
          }
        }
      });

      await batch.commit();
      console.log(`CleanUpAndTransform function completed 
        successfully. Estimated removals: ${removalCount}`);
      res.status(200).send(`Data cleaned and transformed 
        successfully. Estimated removals: ${removalCount}`);
    } catch (error) {
      console.error("Error in CleanUpAndTransform function:", error);
      res.status(500).send("An error occurred during the update process.");
    }
  }
);
