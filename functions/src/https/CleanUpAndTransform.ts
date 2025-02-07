import {createHttpTrigger} from "../lib/functionsClient";
import {registrationDataRef, demographicDataRef} from "../lib/firestoreClient";

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

      const registrationDataMap = new Map();
      registrationData.forEach((doc) => {
        const data = doc.data();
        registrationDataMap.set(data.passId, data.createdAt);
      });

      console.log(`Registration Map: ${JSON.stringify(registrationDataMap)}`);

      const batch = demographicDataRef.firestore.batch();

      demographicData.forEach((doc) => {
        const data = doc.data();
        console.log(`Demographic Data: ${JSON.stringify(data)}`);
        if (!data.createdAt) {
          console.log("Found a document without a createdAt field.");
          console.log(`Pass ID: ${data.passId}`);
          const createdAt = registrationDataMap.get(data.passId);
          if (createdAt) {
            console.log("Found a createdAt field.");
            console.log(`Created At: ${createdAt}`);
            const docRef = demographicDataRef.doc(doc.id);
            batch.update(docRef, {createdAt});
          } else {
            console.log("No createdAt field found.");
          }
        }
      });

      await batch.commit();

      res.status(200).send("Documents have been successfully updated.");
      console.log("CleanUpAndTransform function completed successfully.");
    } catch (error) {
      console.error("Error in CleanUpAndTransform function:", error);
      res.status(500).send("An error occurred during the update process.");
    }
  }
);
