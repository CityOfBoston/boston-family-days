
/**
 * The student registration data structure.
 * @property {string} school - The school of the student.
 * @property {string} firstName - The first name of the student.
 * @property {string} lastName - The last name of the student.
 * @property {string} email - The email of the student.
 * @property {string} middleName - The middle name of the student.
 * @property {string} parentFirstName - The first name of the parent.
 * @property {string} parentLastName - The last name of the parent.
 * @property {string} preferredCommunicationLanguage
 * - The preferred communication language of the student.
 * @property {string} phoneNumber - The phone number of the student.
 * @property {string} street1 - The street address of the student.
 * @property {string} street2 - The street address of the student.
 * @property {string} neighborhood - The neighborhood of the student.
 * @property {string} zip - The zip code of the student.
 * @property {string} studentId - The student ID of the student.
 * @property {string} dob - The date of birth of the student.
 * @property {string} grade - The grade of the student.
 * @property {string} languageSpokenAtHome
 * - The language spoken at home of the student.
 * @property {string} englishLearner
 * - Whether the student is an English learner.
 * @property {string} race - The race of the student.
 * @property {string} ethnicity - The ethnicity of the student.
 * @property {string} programs - The programs of the student.
 * @property {string} iep - Whether the student is on an IEP.
*/
export interface StudentRegistrationData {
    school: string,
    firstName: string,
    lastName: string,
    email: string,
    middleName?: string,
    parentFirstName?: string,
    parentLastName?: string,
    preferredCommunicationLanguage?: string,
    phoneNumber?: string,
    street1?: string,
    street2?: string,
    neighborhood?: string,
    zip?: string,
    studentId?: string,
    dob?: string,
    grade?: string,
    languageSpokenAtHome?: string,
    englishLearner?: string,
    race?: string,
    ethnicity?: string,
    programs?: string,
    iep?: string,
}

/**
 * The upaknee subscriber data structure per student.
 * @property {string} passId - The pass ID of the subscriber.
 * @property {string} firstName - The first name of the subscriber.
 * @property {string} lastName - The last name of the subscriber.
 * @property {string} school - The school of the subscriber.
 */
export interface StudentSubscriberData {
    passId: string;
    firstName: string;
    lastName: string;
    school: string;
}
