import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {parse} from "csv-parse/sync";
import axios from "axios";
import * as xml2js from "xml2js";

const db = admin.firestore();

// Upaknee API credentials and endpoint
const API_TOKEN = process.env.UPAKNEE_API_TOKEN!;
const API_PASSWORD = process.env.UPAKNEE_API_PASSWORD!;
const NEWSLETTER_ID = process.env.UPAKNEE_API_NEWSLETTER_ID!;
const SUBSCRIBERS_ENDPOINT = `${process.env.UPAKNEE_API_ENDPOINT}/subscribers/`;
const emailCountMap: Record<string, number> = {};

function generateFiveDigitId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function formatSchoolName(schoolName: string): string {
  if (!schoolName) return "";

  return schoolName
    .replace(/[^a-zA-Z]/g, " ") // Replace non-letters with spaces
    .toLowerCase() // Convert all letters to lowercase
    .replace(/\s+/g, " ") // Group consecutive spaces into one space
    .trim() // Remove leading and trailing spaces
    .replace(/\s/g, "-"); // Replace spaces with dashes
}

async function determineStudentIndex(email: string): Promise<number> {
  const snapshot = await db
    .collection("registrationData")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) return 1;

  const indexes = snapshot.docs.map((doc) => doc.data().studentIndex || 0);
  console.log("Found Indexes", indexes);
  return Math.max(...indexes) + 1;
}

export const batchUpload = functions.https.onRequest(async (req, res) => {
  if (!req.headers["content-type"] ||
    !req.headers["content-type"].includes("text/csv")) {
    functions.logger.error("Invalid Content-Type. Expected text/csv.");
    res.status(400).send({error: "Invalid Content-Type. Expected text/csv."});
    return;
  }

  try {
    const records = parse(req.rawBody.toString(), {
      columns: true,
      skip_empty_lines: true,
    });

    functions.logger.info(`Parsed ${records.length} records from CSV input.`);

    const errors: string[] = [];
    const batch = db.batch();

    for (const row of records) {
      const {School, StudentNo, FirstName,
        LastName, ContactName, ContactEmail} = row;

      const requiredFields = {School, StudentNo,
        FirstName, LastName, ContactName, ContactEmail};

      // Validate required fields
      for (const [field, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
          errors.push(
            `Missing required field: ${field} in row ${JSON.stringify(row)}`);
        }
      }

      // Validate email format
      if (ContactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ContactEmail)) {
        errors.push(
          `Invalid email format for ContactEmail in row ${JSON.stringify(row)}`
        );
      }

      // Validate StudentNo as integer
      if (StudentNo && isNaN(parseInt(StudentNo, 10))) {
        errors.push(
          `StudentNo must be an integer in row ${JSON.stringify(row)}`);
      }

      if (errors.length > 0) {
        continue;
      }

      const schoolValue = formatSchoolName(School);
      const id = generateFiveDigitId();
      const [parentFirstName, ...parentLastNameArr] = ContactName.split(" ");
      const parentLastName = parentLastNameArr.join(" ");
      // Determine the base student index
      const baseStudentIndex = await determineStudentIndex(ContactEmail);
      console.log("Base Student Index", baseStudentIndex);
      // Increment email count for repeated entries in the batch
      if (!emailCountMap[ContactEmail]) {
        emailCountMap[ContactEmail] = 0;
      }
      emailCountMap[ContactEmail]++;
      const studentIndex = baseStudentIndex + emailCountMap[ContactEmail] - 1;
      console.log("Email Counts", emailCountMap);
      console.log("Student Index", studentIndex);

      // Check student index before proceeding
      if (studentIndex > 8) {
        functions.logger.info(
          `Student index ${studentIndex} exceeds limit. 
          Setting status to inactive for student with email: ${ContactEmail}`
        );
        batch.set(db.collection("registrationData").doc(id), {
          id,
          email: ContactEmail,
          studentIndex: "8+",
          school: schoolValue,
          firstName: FirstName,
          lastName: LastName,
          parentFirstName,
          parentLastName,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          profileId: "not applicable",
          status: "inactive",
        });

        // Add demographic data
        batch.set(db.collection("demographicData").doc(id), {
          id,
          studentId: StudentNo,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        continue;
      }

      // Create registrationData entry
      batch.set(db.collection("registrationData").doc(id), {
        id,
        email: ContactEmail,
        studentIndex,
        school: schoolValue,
        firstName: FirstName,
        lastName: LastName,
        parentFirstName,
        parentLastName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create demographicData entry
      batch.set(db.collection("demographicData").doc(id), {
        id,
        studentId: StudentNo,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Add subscriber to email service
      try {
        const profileId = await addSubscriberToEmailService(id, studentIndex,
          ContactEmail, {
            firstName: FirstName,
            lastName: LastName,
            school: schoolValue,
          });
        functions.logger.info(
          `Retrieved Profile ID for email ${ContactEmail}: ${profileId}`);
        batch.update(db.collection("registrationData").doc(id),
          {profileId, status: "active"});
      } catch (error) {
        functions.logger.error(
          `Failed to add subscriber to email service for email: 
          ${ContactEmail}`, error);
      }
    }

    if (errors.length > 0) {
      functions.logger.info(
        "Validation errors occurred during processing:", errors);
      res.status(400).send({errors});
      return;
    }

    await batch.commit();
    functions.logger.info("Batch upload completed successfully.");
    res.status(200).send({status: "success"});
  } catch (error) {
    functions.logger.error("Error processing batch upload:", error);
    res.status(500).send({error: "Internal Server Error"});
  }
});

async function addSubscriberToEmailService(
  uniqueId: string,
  studentIndex: number,
  email: string,
  studentData: { firstName: string;
    lastName: string; school: string }
) {
  console.log("Student Index", studentIndex);
  if (studentIndex > 8) {
    console.log("Exceeded 8");
    return {status: "not applicable",
      message: "Student index exceeds limit."};
  }
  const prefix = ["first", "second", "third", "fourth",
    "fifth", "sixth", "seventh", "eighth"][studentIndex - 1];
  console.log("Prefix", prefix);
  const xmlData = `
  <subscriber>
    <email>${email}</email>
    <update-existing>true</update-existing>
    <suppress-confirmation>true</suppress-confirmation>
    <${prefix}-student-pass-id>
    ${uniqueId}</${prefix}-student-pass-id>
    <${prefix}-student-first-name>
    ${studentData.firstName}</${prefix}-student-first-name>
    <${prefix}-student-last-name>
    ${studentData.lastName}</${prefix}-student-last-name>
    <${prefix}-student-school-name>
    ${studentData.school}</${prefix}-student-school-name>
    <subscriptions>
      <subscription>
        <newsletter-id>${NEWSLETTER_ID}</newsletter-id>
      </subscription>
    </subscriptions>
  </subscriber>`;

  console.log("XML Data", xmlData);

  const response = await axios.post(SUBSCRIBERS_ENDPOINT, xmlData, {
    headers: {"Content-Type": "application/xml",
      "Accept": "application/xml"},
    auth: {username: API_TOKEN, password: API_PASSWORD},
  });

  const parsedData =
    await xml2js.parseStringPromise(response.data, {explicitArray: false});
  const profileId = parsedData?.result?.["profile-id"];

  return profileId;
}

