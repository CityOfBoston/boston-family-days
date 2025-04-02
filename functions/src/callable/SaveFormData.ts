import {onCall, HttpsError} from "firebase-functions/v2/https";
import {addStudentAndUpdateSubscriber} from "../lib/functionsClient";
import {StudentRegistrationData} from "../lib/types";
import {sanitizeString, sanitizeSchoolName} from "../lib/utils";

/**
 * Saves the form data to the database.
 * @param {functions.CallableRequest} request - The request object.
 * @returns {Promise<{status: string,
 * successData: {passId: string, studentName: string, school: string}}>}
 * The status of the operation and the success data.
 */
export const saveFormData = onCall(async (request) => {
  try {
    const data = request.data;

    // Make sure all strings are properly sanitized and
    // do not include any special characters.
    const studentData: StudentRegistrationData = {
      firstName: sanitizeString(
        String(data?.studentData?.firstName || "")
      ),
      lastName: sanitizeString(
        String(data?.studentData?.lastName || "")
      ),
      school: sanitizeSchoolName(
        String(data?.studentData?.school || "")
      ),
      email: data?.contactData?.email || "",
      middleName: sanitizeString(
        String(data?.studentData?.middleName || "")
      ),
      parentFirstName: sanitizeString(
        String(data?.contactData?.parentFirstName || "")
      ),
      parentLastName: sanitizeString(
        String(data?.contactData?.parentLastName || "")
      ),
      preferredCommunicationLanguage: sanitizeString(
        String(data?.contactData?.preferredCommunicationLanguage || "")
      ),
      phoneNumber: sanitizeString(
        String(data?.contactData?.phoneNumber || "")
      ),
      street1: sanitizeString(
        String(data?.addressData?.street1 || "")
      ),
      street2: sanitizeString(
        String(data?.addressData?.street2 || "")
      ),
      neighborhood: sanitizeString(
        String(data?.addressData?.neighborhood || "")
      ),
      zip: sanitizeString(
        String(data?.addressData?.zip || "")
      ),
      studentId: sanitizeString(
        String(data?.studentData?.studentId || "")
      ),
      dob: sanitizeString(
        String(data?.studentData?.dob || "")
      ),
      grade: sanitizeString(
        String(data?.studentData?.grade || "")
      ),
      languageSpokenAtHome: sanitizeString(
        String(data?.languageData?.languageSpokenAtHome || "")
      ),
      englishLearner: sanitizeString(
        String(data?.languageData?.englishLearner || "")
      ),
      race: data?.demographicData?.race || [],
      ethnicity: data?.demographicData?.ethnicity || [],
      programs: data?.otherData?.programs || [],
      iep: sanitizeString(
        String(data?.otherData?.iep || "")
      ),
    };

    const {passId} = await addStudentAndUpdateSubscriber(studentData);

    return {
      status: "success",
      successData: {
        passId: passId,
        studentName: `${studentData.firstName} ${studentData.lastName}`,
        school: studentData.school,
      },
    };
  } catch (error: any) {
    console.error("Error:", error.message);
    throw new HttpsError("internal", error.message || "An error occurred.");
  }
});
