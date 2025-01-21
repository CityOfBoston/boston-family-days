import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const db = admin.firestore();

export const cleanUpAndTransformData =
functions.https.onRequest(async (req, res) => {
  try {
    const registrationDataRef = db.collection("registrationData");
    const demographicDataRef = db.collection("demographicData");

    const registrationSnapshot = await registrationDataRef.get();
    if (registrationSnapshot.empty) {
      res.status(200).send("No documents found in registrationData.");
      return;
    }

    const demographicSnapshot = await demographicDataRef.get();
    if (demographicSnapshot.empty) {
      res.status(200).send("No documents found in demographicData.");
      return;
    }

    const batch = db.batch();
    let updatesCount = 0;
    let skipsCount = 0;

    // Process demographicData to remove familyLanguage and firstLanguage
    for (const doc of demographicSnapshot.docs) {
      const demographicData = doc.data();

      const updatedDemographicData: { [key: string]: any } = {};
      if ("familyLanguage" in demographicData) {
        updatedDemographicData.familyLanguage =
        admin.firestore.FieldValue.delete();
      }
      if ("firstLanguage" in demographicData) {
        updatedDemographicData.firstLanguage =
        admin.firestore.FieldValue.delete();
      }

      if (Object.keys(updatedDemographicData).length > 0) {
        batch.update(doc.ref, updatedDemographicData);
        updatesCount++;
      }
    }

    // Process registrationData to infer languageSpokenAtHome
    for (const doc of registrationSnapshot.docs) {
      const registrationData = doc.data();
      const preferredCommunicationLanguage =
        registrationData.preferredCommunicationLanguage || "";

      const demographicDocs = await demographicDataRef
        .where("id", "==", registrationData.id)
        .get();

      if (!demographicDocs.empty && preferredCommunicationLanguage) {
        for (const demographicDoc of demographicDocs.docs) {
          const demographicData = demographicDoc.data();
          if (!demographicData.languageSpokenAtHome) {
            batch.update(demographicDoc.ref, {
              languageSpokenAtHome: preferredCommunicationLanguage,
            });
          } else {
            skipsCount++;
          }
        }
      }
    }

    // Commit the batch
    await batch.commit();

    const responseMessage = `Processed ${updatesCount} 
    demographicData documents to remove fields.`;
    const skipsMessage = `Skipped ${skipsCount} demographicData documents 
    where languageSpokenAtHome already existed.`;
    res.status(200).send(`${responseMessage} ${skipsMessage}`);
  } catch (error) {
    console.error("Error during cleanup and transformation:", error);
    res.status(500).send("An error occurred");
  }
});
