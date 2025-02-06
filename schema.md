We need to integrate registration data collected for the Boston Family Days program into CIVIS. The data is currently stored in Firestore and consists of approximately 450 rows, projected to grow to around 1000 rows by the end of the year. We would like to implement an asynchronous batch upload to CIVIS. Below is the structure of the data we are working with and details about each field.

Student data is stored as registration data and demographic data due to data security and privacy compliance reasons.

The registrationData data includes the following fields:
- passId: a unique, non-optional five-character string consisting of uppercase letters and numbers (36 possibilities for each digit), for example, A1B2C.
- email: the parent’s contact email and: optional.
- school: the name of the student’s school and: non-optional.
- firstName: the student’s first name and: non-optional.
- middleName: the student’s middle name and: optional.
- lastName: the student’s last name and: non-optional.
- parentFirstName: the parent’s first name and: optional.
- parentLastName: the parent’s last name and: optional.
- preferredCommunicationLanguage: the parent’s preferred communication language and: optional.
- phoneNumber: the parent’s phone number and: optional.
- createdAt: a timestamp indicating when the entry was created and: non-optional.
- status: derived from the studentIndex and indicates the registration status. It: non-optional.

The demographicData data includes the following fields:
- passId: see above.
- street1: the primary address line and: non-optional.
- street2: the secondary address line and: optional.
- neighborhood: the neighborhood of residence within Boston and: non-optional.
- zip: the ZIP code within Boston and: non-optional.
- studentId: inputted by the parent, varies by school, and: optional.
- dob: the date of birth and: non-optional. The student must be older than three years of age (assumed born after 2000).
- grade: the current grade level of the student, from kindergarten to 12th grade, and: non-optional.
- languageSpokenAtHome: the primary language spoken at home and: optional.
- englishLearner indicates if the student: an English learner and: optional.
- race represents the racial category and: optional.
- ethnicity represents the ethnicity category and: optional.
- programs indicates special education programs the student: enrolled in and: optional.
- iep indicates if the student has an Individualized Education Program (IEP) and: optional.
- createdAt: a timestamp indicating when the entry was created and: non-optional.
