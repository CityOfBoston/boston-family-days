import * as admin from "firebase-admin";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import axios from "axios";
import * as xml2js from "xml2js";

const db = admin.firestore();

// Upaknee API credentials and endpoint
const API_TOKEN = process.env.UPAKNEE_API_TOKEN!;
const API_PASSWORD = process.env.UPAKNEE_API_PASSWORD!;
const NEWSLETTER_ID = process.env.UPAKNEE_API_NEWSLETTER_ID;
const SUBSCRIBERS_ENDPOINT = `${process.env.UPAKNEE_API_ENDPOINT}/subscribers/`;

function generateFiveDigitId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function determineStudentIndex(email: string): Promise<number> {
  const snapshot = await db.collection("registrationData")
    .where("email", "==", email)
    .get();

  if (snapshot.empty) return 1;

  const indexes = snapshot.docs.map((doc) => doc.data().studentIndex || 0);
  return Math.max(...indexes) + 1;
}

export const saveFormData = onCall(async (request) => {
  try {
    const data = request.data;

    const studentData = data?.studentData || {};
    const addressData = data?.addressData || {};
    const contactData = data?.contactData || {};
    const languageData = data?.languageData || {};
    const demographicData = data?.demographicData || {};
    const otherData = data?.otherData || {};

    if (!studentData.firstName || !studentData.lastName ||
      !studentData.school) {
      throw new HttpsError("invalid-argument", "Missing required fields.");
    }

    const email = contactData?.email;
    if (!email) throw new HttpsError("invalid-argument", "Email is required.");

    const uniqueId = generateFiveDigitId();
    const studentIndex = await determineStudentIndex(email);

    const registrationEntry = {
      id: uniqueId,
      email: contactData?.email,
      studentIndex: studentIndex,
      school: studentData.school,
      firstName: studentData.firstName,
      middleName: studentData.middleName || "",
      parentFirstName: contactData?.parentFirstName || "",
      parentLastName: contactData?.parentLastName || "",
      lastName: studentData.lastName,
      preferredCommunicationLanguage:
        contactData?.preferredCommunicationLanguage || "",
      phoneNumber: contactData?.phoneNumber || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: studentIndex > 8 ? "n/a" : studentIndex > 1 ?
        "active" : "pending",
    };

    const demographicEntry = {
      id: uniqueId,
      street1: addressData?.street1 || "",
      street2: addressData?.street2 || "",
      neighborhood: addressData?.neighborhood || "",
      zip: addressData?.zip || "",
      studentId: studentData.studentId || "",
      dob: studentData.dob || "",
      grade: studentData.grade || "",
      languageSpokenAtHome: languageData?.languageSpokenAtHome || "",
      englishLearner: languageData?.englishLearner || "",
      race: demographicData?.race || [],
      ethnicity: demographicData?.ethnicity || "",
      programs: otherData?.programs || [],
      iep: otherData?.iep || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("registrationData").add(registrationEntry);
    await db.collection("demographicData").add(demographicEntry);

    if (studentIndex > 8) {
      return {status: "not applicable",
        message: "Student index exceeds limit."};
    }

    const prefix = ["first", "second", "third", "fourth",
      "fifth", "sixth", "seventh", "eighth"][studentIndex - 1];
    const xmlData = `
  <subscriber>
    <email>${email}</email>
    <existing-update>true</existing-update>
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

    const response = await axios.post(SUBSCRIBERS_ENDPOINT, xmlData, {
      headers: {"Content-Type": "application/xml", "Accept": "application/xml"},
      auth: {username: API_TOKEN, password: API_PASSWORD},
    });

    const parsedData =
    await xml2js.parseStringPromise(response.data, {explicitArray: false});
    const profileId = parsedData?.result?.["profile-id"];
    if (!profileId) {
      throw new HttpsError("internal", "Failed to retrieve profile ID.");
    }

    await db.collection("registrationData")
      .where("id", "==", uniqueId)
      .limit(1)
      .get()
      .then((snapshot) => {
        const doc = snapshot.docs[0];
        if (doc) doc.ref.update({profileId, status: "pending"});
      });

    return {
      status: "success",
      successData: {id: uniqueId,
        studentName: `${studentData.firstName} ${studentData.lastName}`,
        school: studentData.school},
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    throw new HttpsError("internal", error.message || "An error occurred.");
  }
});
