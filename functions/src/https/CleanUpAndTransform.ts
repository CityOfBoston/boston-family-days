import {createHttpTrigger} from "../lib/functionsClient";
import {registrationDataRef, demographicDataRef} from "../lib/firestoreClient";
import {nanoid} from "nanoid";

export const cleanUpAndTransform = createHttpTrigger(
  "private",
  async (req, res) => {
    console.log("CleanUpAndTransform function started.");

    try {
      const registrationData = await registrationDataRef.get();
      const demographicData = await demographicDataRef.get();

      for (const doc of registrationData.docs) {
        const id = doc.id;
        if (id.length !== 21) {
          const newId = nanoid();
          const data = doc.data();
          const createdAt = data.createdAt;
          if (createdAt !== undefined) {
            await registrationDataRef.doc(newId).set({
              ...data,
              createdAt: createdAt,
            });
          } else {
            console.log(`Document with ID ${id} has no createdAt timestamp.`);
            await registrationDataRef.doc(newId).set(
              {...data, createdAt: new Date()});
          }
          await registrationDataRef.doc(id).delete();
          console.log(`Document with ID ${id} updated to new ID ${newId}.`);
        }
      }

      for (const doc of demographicData.docs) {
        const id = doc.id;
        if (id.length !== 21) {
          const newId = nanoid();
          const data = doc.data();
          const createdAt = data.createdAt;
          if (createdAt !== undefined) {
            await demographicDataRef.doc(newId).set({
              ...data,
              createdAt: createdAt,
            });
          } else {
            await demographicDataRef.doc(newId).set(data);
          }
          await demographicDataRef.doc(id).delete();
          console.log(`Document with ID ${id} updated to new ID ${newId}.`);
        }
      }

      res.status(200).send("Documents have been successfully updated.");
      console.log("CleanUpAndTransform function completed successfully.");
    } catch (error) {
      console.error("Error in CleanUpAndTransform function:", error);
      res.status(500).send("An error occurred during the update process.");
    }
  }
);
