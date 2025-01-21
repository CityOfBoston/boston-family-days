import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import * as stringSimilarity from "string-similarity";

const db = admin.firestore();

// Upaknee API credentials and endpoint
const API_TOKEN = process.env.UPAKNEE_API_TOKEN!;
const API_PASSWORD = process.env.UPAKNEE_API_PASSWORD!;
const NEWSLETTER_ID = process.env.UPAKNEE_API_NEWSLETTER_ID!;
const SUBSCRIBERS_ENDPOINT = `${process.env.UPAKNEE_API_ENDPOINT}/subscribers/`;

type RegistrationData = {
  id: string; // Firestore document ID
  email: string;
  firstName: string;
  lastName: string;
  school: string;
  profileId?: string; // Optional field
};

export const handleDuplicates = functions.https.onRequest(async (req, res) => {
  try {
    // Step 1: Fetch and deduplicate Firestore data
    functions.logger.info("Fetching records from Firestore...");
    const registrationDataSnapshot =
    await db.collection("registrationData").get();
    const registrationData = registrationDataSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RegistrationData[];

    const duplicateGroups: { [email: string]: any[] } = {};
    const emailToStudentMap: { [email: string]: any[] } = {};

    functions.logger.info("Detecting duplicates...");
    for (const record of registrationData) {
      const {email, firstName, lastName} = record;

      if (!duplicateGroups[email]) {
        duplicateGroups[email] = [];
        emailToStudentMap[email] = [];
      }

      let isDuplicate = false;
      for (const existingRecord of duplicateGroups[email]) {
        const nameSimilarity = stringSimilarity.compareTwoStrings(
          `${firstName} ${lastName}`,
          `${existingRecord.firstName} ${existingRecord.lastName}`
        );

        if (nameSimilarity > 0.85) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        duplicateGroups[email].push(record);
        emailToStudentMap[email].push({
          studentIndex: emailToStudentMap[email].length + 1,
          id: record.id,
          firstName,
          lastName,
          school: record.school,
        });
      } else {
        functions.logger.info(
          `Deleting duplicate record from Firestore: ${record.id}`);
        await db.collection("registrationData").doc(record.id).delete();
        await db.collection("demographicData").doc(record.id).delete();
      }
    }

    functions.logger.info("Batch removal of duplicates completed.");

    // Step 2: Update Upaknee
    functions.logger.info("Syncing with Upaknee...");
    for (const [email, students] of Object.entries(emailToStudentMap)) {
      // Build XML payload
      const allStudentTags = Array(8).fill("").map((_, index) => {
        const student = students[index];
        if (student) {
          return `
            <${["first", "second", "third",
    "fourth", "fifth", "sixth", "seventh",
    "eighth"][index]}-student-pass-id>
            ${student.id}</${["first", "second",
  "third", "fourth", "fifth", "sixth", "seventh",
  "eighth"][index]}-student-pass-id>
            <${["first", "second", "third",
    "fourth", "fifth", "sixth", "seventh", "eighth"][index]}-student-first-name>
            ${student.firstName}</${["first",
  "second", "third", "fourth", "fifth", "sixth",
  "seventh", "eighth"][index]}-student-first-name>
            <${["first", "second", "third", "fourth",
    "fifth", "sixth", "seventh", "eighth"][index]}-student-last-name>
            ${student.lastName}</${["first",
  "second", "third", "fourth", "fifth",
  "sixth", "seventh", "eighth"][index]}-student-last-name>
            <${["first", "second", "third", "fourth",
    "fifth", "sixth", "seventh",
    "eighth"][index]}-student-school-name>
            ${student.school}</${["first", "second",
  "third", "fourth", "fifth", "sixth", "seventh",
  "eighth"][index]}-student-school-name>
          `;
        } else {
          return `
            <${["first", "second", "third",
    "fourth", "fifth", "sixth", "seventh",
    "eighth"][index]}-student-pass-id></${["first", "second",
  "third", "fourth", "fifth", "sixth", "seventh",
  "eighth"][index]}-student-pass-id>
            <${["first", "second",
    "third", "fourth", "fifth",
    "sixth", "seventh", "eighth"][index]}-student-first-name></${[
  "first", "second", "third", "fourth", "fifth", "sixth",
  "seventh", "eighth"][index]}-student-first-name>
            <${["first", "second",
    "third", "fourth", "fifth",
    "sixth", "seventh", "eighth"][index]}-student-last-name></${["first",
  "second", "third", "fourth", "fifth",
  "sixth", "seventh", "eighth"][index]}-student-last-name>
            <${["first", "second",
    "third", "fourth", "fifth", "sixth", "seventh",
    "eighth"][index]}-student-school-name></${["first",
  "second", "third", "fourth", "fifth",
  "sixth", "seventh", "eighth"][index]}-student-school-name>
          `;
        }
      }).join("");

      const xmlData = `
        <subscriber>
          <email>${email}</email>
          <update-existing>true</update-existing>
          <suppress-confirmation>true</suppress-confirmation>
          ${allStudentTags}
          <subscriptions>
              <subscription>
                  <newsletter-id>${NEWSLETTER_ID}</newsletter-id>
              </subscription>
          </subscriptions>
        </subscriber>
      `;

      try {
        await axios.post(SUBSCRIBERS_ENDPOINT, xmlData, {
          headers: {"Content-Type": "application/xml"},
          auth: {username: API_TOKEN, password: API_PASSWORD},
        });
        functions.logger.info(
          `Successfully updated Upaknee for email: ${email}`);
      } catch (error) {
        functions.logger.error(
          `Failed to update Upaknee for email: ${email}`, error);
      }
    }

    functions.logger.info(
      "Upaknee synchronization completed.");
    res.status(200).send({status: "success",
      message: "Duplicates removed and Upaknee updated."});
  } catch (error) {
    functions.logger.error(
      "Error processing duplicates and syncing:", error);
    res.status(500).send({status: "error",
      message: "An error occurred.", error});
  }
});
