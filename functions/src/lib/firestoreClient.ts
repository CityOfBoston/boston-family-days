import * as admin from "firebase-admin";
import {generateFiveDigitId} from "./utils";
import {StudentRegistrationData, StudentSubscriberData} from "./types";
import {updateSubscriberGroup} from "./upakneeClient";
import {DateTime} from "luxon";
import {Timestamp,
  Query,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {
  TIME_FORMAT,
  TIME_ZONE,
  isValidUnixTimestamp,
  convertLuxonDateTimeToFirestoreTimestamp,
} from "./dates";
import {nanoid} from "nanoid";

export const db = admin.firestore();
export const registrationDataRef = db.collection("registrationData");
export const demographicDataRef = db.collection("demographicData");

/**
 * Generates a unique 5-character ID for a student using
 * the generateFiveDigitId function. It recursively checks
 * the database for the ID and generates a new one if it
 * already exists. After 10 attempts, it logs a message and
 * returns the 5-character ID with a random character swapped
 * out for a special character.
 * @return {Promise<string>} A 5-character ID.
 */
export const generateUniquePassId = async (): Promise<string> => {
  console.log("Generating unique pass ID");
  let attempts = 0;
  let newPassId = generateFiveDigitId();

  while (attempts < 5) {
    console.log(`Attempt ${attempts + 1}: Checking pass ID ${newPassId}`);
    const snapshot = await registrationDataRef
      .where("passId", "==", newPassId)
      .get();

    if (snapshot.empty) {
      console.log(`Pass ID ${newPassId} is unique`);
      return newPassId;
    }

    newPassId = generateFiveDigitId();
    attempts++;
  }
  console.log(
    "Max reroll attempts reached. Generating ID with special character."
  );
  const idArray = newPassId.split("");
  const randomIndex = Math.floor(Math.random() * idArray.length);
  const specialCharacters = "!@#$%&";
  idArray[randomIndex] = specialCharacters[
    Math.floor(Math.random() * specialCharacters.length)];
  return idArray.join("");
};


/**
 * Gets all documents in registrationData
 * with the same email as provided.
 * @param {string} email
 * @return {Promise<admin.firestore.QuerySnapshot>}
 * A snapshot of all documents with the same email.
 */
const getDocumentsByEmail = async (email: string):
Promise<admin.firestore.QuerySnapshot> => {
  return await registrationDataRef
    .where("email", "==", email)
    .limit(8)
    .get();
};

/**
 * Given a student's registration data,
 * checks if there is a student with the
 * same email, firstName and lastName.
 * Uses the getDocumentsByEmail helper function.
 * @param {StudentRegistrationData} studentRegistrationData
 * @return {Promise<string>} passId of the student if found,
 * otherwise returns "n/a"
 */
const checkForDuplicateStudent = async (
  studentRegistrationData: StudentRegistrationData,
): Promise<string> => {
  const documents = await getDocumentsByEmail(studentRegistrationData.email);
  const duplicateDoc = documents.docs.find((doc) => {
    const docData = doc.data();
    return docData.firstName.trim().toLowerCase() ===
      studentRegistrationData.firstName.trim().toLowerCase() &&
      docData.lastName.trim().toLowerCase() ===
      studentRegistrationData.lastName.trim().toLowerCase();
  });
  return duplicateDoc ? duplicateDoc.data().passId : "n/a";
};

/**
 * Given a student's registration data, uses the
 * getDocumentsByEmail helper function to calculate
 * the student's index and status amongst peers with the same email
 * if added to the database.
 * The status should be "n/a" if there are already 8 students
 * in the set of documents.
 * Otherwise, the status should be "active" if all other students are active.
 * If the above conditions are not met, the status should be "pending".
 * @param {StudentRegistrationData} studentRegistrationData
 * @return {Promise<{studentIndex: number, status: string}>}
 * An object containing the studentIndex and status.
 */
const calculateStudentIndexAndStatus = async (
  studentRegistrationData: StudentRegistrationData,
): Promise<{studentIndex: number, status: string}> => {
  const documents = await getDocumentsByEmail(studentRegistrationData.email);
  const studentIndex = documents.docs.length;
  if (studentIndex === 0) {
    return {studentIndex: 0, status: "pending"};
  } else if (studentIndex >= 8) {
    return {studentIndex: -1, status: "n/a"};
  }
  const status = documents.docs.every(
    (doc) => doc.data().status === "active") ? "active" : "pending";
  return {studentIndex, status};
};

/**
 * Adds a new student to the firebase database. Updates both the
 * registrationData and the studentData collections. If there is already
 * a student with the same email, firstName and lastName,
 * it should only not add a new student
 * and return the existing student's index and passId with status "duplicate".
 * Otherwise, it should add a new student and return the new student's index,
 * status and passId.
 * @param {StudentRegistrationData} studentRegistrationData
 * - The student registration data.
 * @param {boolean} suppressConfirmation
 * - Whether to suppress confirmation.
 * @return {Promise<{studentIndex: number, status: string, passId: string}>}
 * An object containing the studentIndex, status, and passId.
 */
export const addStudentToFirebase = async (
  studentRegistrationData: StudentRegistrationData,
  suppressConfirmation = false
): Promise<{studentIndex: number, status: string, passId: string}> => {
  console.log("Adding student to Firebase", studentRegistrationData);
  const duplicateStudentId = await
  checkForDuplicateStudent(studentRegistrationData);
  const {studentIndex, status} = await
  calculateStudentIndexAndStatus(studentRegistrationData);
  if (duplicateStudentId !== "n/a") {
    console.log("Duplicate student found", studentRegistrationData);
    return {
      studentIndex,
      status: "duplicate",
      passId: duplicateStudentId,
    };
  }
  const passId = await generateUniquePassId();
  console.log("Generated pass ID", passId);
  const registrationEntry = {
    passId: passId,
    email: studentRegistrationData.email,
    school: studentRegistrationData.school,
    firstName: studentRegistrationData.firstName,
    lastName: studentRegistrationData.lastName,
    status: suppressConfirmation ? "active" : status,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...studentRegistrationData.middleName &&
    {middleName: studentRegistrationData.middleName},
    ...studentRegistrationData.parentFirstName &&
    {parentFirstName: studentRegistrationData.parentFirstName},
    ...studentRegistrationData.parentLastName &&
    {parentLastName: studentRegistrationData.parentLastName},
    ...studentRegistrationData.preferredCommunicationLanguage &&
    {preferredCommunicationLanguage:
      studentRegistrationData.preferredCommunicationLanguage},
    ...studentRegistrationData.phoneNumber &&
    {phoneNumber: studentRegistrationData.phoneNumber},
  };

  const demographicEntry = {
    passId: passId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...studentRegistrationData.street1 &&
    {street1: studentRegistrationData.street1},
    ...studentRegistrationData.street2 &&
    {street2: studentRegistrationData.street2},
    ...studentRegistrationData.neighborhood &&
    {neighborhood: studentRegistrationData.neighborhood},
    ...studentRegistrationData.zip &&
    {zip: studentRegistrationData.zip},
    ...studentRegistrationData.studentId &&
    {studentId: studentRegistrationData.studentId},
    ...studentRegistrationData.dob &&
    {dob: studentRegistrationData.dob},
    ...studentRegistrationData.grade &&
    {grade: studentRegistrationData.grade},
    ...studentRegistrationData.languageSpokenAtHome &&
    {languageSpokenAtHome:
      studentRegistrationData.languageSpokenAtHome},
    ...studentRegistrationData.englishLearner &&
    {englishLearner: studentRegistrationData.englishLearner},
    ...studentRegistrationData.race &&
    {race: studentRegistrationData.race},
    ...studentRegistrationData.ethnicity &&
    {ethnicity: studentRegistrationData.ethnicity},
    ...studentRegistrationData.programs &&
    {programs: studentRegistrationData.programs},
    ...studentRegistrationData.iep &&
    {iep: studentRegistrationData.iep},
  };

  await registrationDataRef.doc(nanoid()).set(registrationEntry);
  console.log("Added registration entry to Firestore", registrationEntry);
  await demographicDataRef.doc(nanoid()).set(demographicEntry);
  console.log("Added demographic entry to Firestore", demographicEntry);
  return {
    studentIndex,
    status,
    passId,
  };
};

/**
 * Updates the profileId and status in
 * matching student entries in registrationData
 * given the passId and profileId.
 * Throws an error if the student is not found.
 * @param {string} passId - The pass ID of the student.
 * @param {string} profileId - The profile ID to update.
 */
export const updateProfileId =
  async (passId: string, profileId: string):
Promise<void> => {
    const querySnapshot = await registrationDataRef
      .where("passId", "==", passId)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      await querySnapshot.docs[0].ref.update({profileId});
    } else {
      throw new Error("No student found with the given passId.");
    }
  };

/**
 * Syncs the registrationData collection with the Upaknee service.
 * Groups documents by email and orders them by createdAt.
 * Assembles Subscriber objects and syncs with Upaknee.
 * @return {Promise<void>}
 * A promise that resolves when the operation is complete.
 */
export const syncSubscribers = async (): Promise<void> => {
  console.log("Syncing subscribers with Upaknee");

  // Group registrationData by email
  const snapshot = await registrationDataRef.get();
  const emailGroups:
  Record<string, admin.firestore.QueryDocumentSnapshot[]> = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const email = data.email;
    if (!emailGroups[email]) {
      emailGroups[email] = [];
    }
    emailGroups[email].push(doc);
  });

  // Process each email group
  for (const email in emailGroups) {
    if (Object.prototype.hasOwnProperty.call(emailGroups, email)) {
      console.log(`Processing email group: ${email}`);
      // Order documents by createdAt
      const orderedDocs = emailGroups[email].sort((a, b) => {
        return a.data().createdAt.toMillis() - b.data().createdAt.toMillis();
      });

      // Assemble Subscriber objects
      const subscribers: StudentSubscriberData[] = orderedDocs.map((doc) => {
        const data = doc.data();
        return {
          passId: data.passId,
          firstName: data.firstName,
          lastName: data.lastName,
          school: data.school,
        };
      });

      // Sync with Upaknee service
      try {
        await updateSubscriberGroup(subscribers, email);
        console.log(`Successfully synced subscribers for email ${email}`);
      } catch (error) {
        console.error(`Failed to sync subscribers for email ${email}:`, error);
      }
    }
  }
};

/**
 * Counts the number of unique emails in the registrationData collection.
 * @return {Promise<number>}
 * The number of unique emails.
 */
export const countUniqueEmails = async (): Promise<number> => {
  const snapshot = await registrationDataRef.get();
  const emailGroups = new Set<string>();
  snapshot.forEach((doc) => {
    const data = doc.data();
    emailGroups.add(data.email);
  });
  return emailGroups.size;
};

/**
 * Given a list of emails, returns emails that are in the
 * registrationData collection but not in the provided list and
 * the earliest createdAt timestamp for each email. Try to
 * use UTC string format for the createdAt timestamp. No
 * seconds are needed. When comparing emails, do not care
 * about the case of the email.
 * @param {string[]} emails
 * - A list of emails.
 * @return {Promise<{emails: string[], createdAt: string}[]>}
 * A list of emails that are not in the registrationData collection.
 */
export const getEmailsNotInList = async (
  emails: string[]
): Promise<{emails: string[], createdAt: string}[]> => {
  const emailsToCheck = emails.map((email) => email.toLowerCase());
  const snapshot = await registrationDataRef.get();
  const emailsNotInList = snapshot.docs.filter((doc) =>
    !emailsToCheck.includes(doc.data().email.toLowerCase()));
  return emailsNotInList.map((doc) => ({
    emails: doc.data().email,
    createdAt: doc.data().createdAt.toDate().toISOString().split(".")[0],
  }));
};

/**
 * Constructs a Firestore query based on date parameters.
 * @param {FirebaseFirestore.CollectionReference} collectionRef
 * - The collection reference to query.
 * @param {string | undefined} date
 * - The date to filter by.
 * @param {string | undefined} startDate
 * - The start date to filter by.
 * @param {string | undefined} endDate
 * - The end date to filter by.
 * @return {Query}
 * - The constructed Firestore query.
 */
export const constructQueryWithDateFilters = (
  collectionRef: FirebaseFirestore.CollectionReference,
  date?: string,
  startDate?: string,
  endDate?: string
): Query => {
  let query = collectionRef.orderBy("createdAt", "asc");

  if (date) {
    const startOfDay = DateTime.fromFormat(date, TIME_FORMAT).startOf("day");
    const endOfDay = DateTime.fromFormat(date, TIME_FORMAT).endOf("day");
    query = query
      .where("createdAt", ">=",
        convertLuxonDateTimeToFirestoreTimestamp(startOfDay))
      .where("createdAt", "<=",
        convertLuxonDateTimeToFirestoreTimestamp(endOfDay));
  } else {
    if (startDate && isValidUnixTimestamp(startDate)) {
      query = query.where("createdAt", ">",
        Timestamp.fromMillis(Number(startDate)));
    }
    if (endDate && isValidUnixTimestamp(endDate)) {
      query = query.where("createdAt", "<",
        Timestamp.fromMillis(Number(endDate)));
    }
  }

  return query;
};

/**
 * Handles pagination for Firestore queries.
 * @param {Query} query
 * - The Firestore query to paginate.
 * @param {number} limit
 * - The maximum number of documents to return.
 * @param {string | undefined} pageToken
 * - The page token to use for pagination.
 * @param {string} collectionName
 * - The name of the collection to paginate.
 */
export const handlePagination = async (
  query: Query,
  limit: number,
  pageToken?: string,
  collectionName = "registrationData"
): Promise<{ query: Query,
  hasMore: boolean, nextPageToken: string | null }> => {
  if (pageToken) {
    const lastVisible =
    await admin.firestore().doc(`${collectionName}/${pageToken}`).get();
    query = query.startAfter(lastVisible);
  }

  query = query.limit(limit + 1);
  const snapshot = await query.get();
  const hasMore = snapshot.docs.length > limit;
  const nextPageToken = hasMore ? snapshot.docs[limit - 1].id : null;

  return {query, hasMore, nextPageToken};
};

/**
 * Processes Firestore documents to extract booking data.
 * @param {QuerySnapshot} snapshot - The Firestore query snapshot.
 * @param {number} limit - The maximum number of documents to process.
 * @return {Array<object>} - An array of processed document data.
 */
export const processFirestoreDocuments = (
  snapshot: QuerySnapshot,
  limit: number
): Array<object> => {
  return snapshot.docs.slice(0, limit).map((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: {
        timestamp: data?.pickupDate?.toMillis(),
        readable: DateTime.fromJSDate(data?.createdAt?.toDate())
          .setZone(TIME_ZONE)
          .toFormat(TIME_FORMAT),
      },
    };
  });
};
