import {createHttpTrigger} from "../lib/functionsClient";
import {
  // registrationDataRef,
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
      // const registrationData = await registrationDataRef.get();
      const demographicData = await demographicDataRef.get();

      // TODO: Go through demographicData and check if the ethnicity field
      // is an array. If not, keep a count of how many documents have an
      // ethnicity field that is not an array.

      let updateCount = 0;

      demographicData.forEach((doc) => {
        const data = doc.data();
        if (data.ethnicity && !Array.isArray(data.ethnicity)) {
          updateCount++;
        }
      });

      res.status(200).send(`Data cleaned and transformed successfully. 
        Updated ${updateCount} documents.`);
    } catch (error) {
      console.error("Error in CleanUpAndTransform function:", error);
      res.status(500).send("An error occurred during the update process.");
    }
  }
);
