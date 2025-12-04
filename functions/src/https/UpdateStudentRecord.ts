import {Request, Response} from "express";
import {createHttpTrigger} from "../lib/functionsClient";
import {updateStudentRecord} from "../lib/firestoreClient";
import {StudentRegistrationData} from "../lib/types";

export const updateStudentRecordEndpoint = createHttpTrigger(
  "private",
  async (req: Request, res: Response) => {
    try {
      const {passId, ...updateData} = req.body;

      if (!passId) {
        res.status(400).json({error: "passId is required"});
        return;
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({
          error: "At least one field to update is required"});
        return;
      }

      // Separate registration fields from demographic fields
      const registrationFields: Partial<StudentRegistrationData> = {};
      const demographicFields: Partial<StudentRegistrationData> = {};

      // Registration fields (from registrationData collection)
      const registrationFieldNames = [
        "email",
        "school",
        "firstName",
        "lastName",
        "middleName",
        "parentFirstName",
        "parentLastName",
        "preferredCommunicationLanguage",
        "phoneNumber",
        "status",
      ];

      // Demographic fields (from demographicData collection)
      const demographicFieldNames = [
        "street1",
        "street2",
        "neighborhood",
        "zip",
        "studentId",
        "dob",
        "grade",
        "languageSpokenAtHome",
        "englishLearner",
        "race",
        "ethnicity",
        "programs",
        "iep",
      ];

      // Categorize fields
      for (const key in updateData) {
        if (Object.prototype.hasOwnProperty.call(updateData, key)) {
          if (registrationFieldNames.includes(key)) {
            registrationFields[key as keyof StudentRegistrationData] =
              updateData[key];
          } else if (demographicFieldNames.includes(key)) {
            demographicFields[key as keyof StudentRegistrationData] =
              updateData[key];
          } else {
            res.status(400).json({
              error: `Unknown field: ${key}. ` +
                `Allowed fields: ${[...registrationFieldNames,
                  ...demographicFieldNames].join(", ")}`,
            });
            return;
          }
        }
      }

      // Update the student record
      const result = await updateStudentRecord(
        passId,
        registrationFields,
        demographicFields
      );

      res.status(200).json({
        status: "success",
        message: "Student record updated successfully",
        passId,
        updatedDocuments: {
          registration: result.registrationDocIds,
          demographic: result.demographicDocIds,
        },
      });
    } catch (error) {
      console.error("Error updating student record:", error);
      if (error instanceof Error &&
        error.message.includes("No student found")) {
        res.status(404).json({error: error.message});
        return;
      }
      res.status(500).json({error: `Internal Server Error: ${error}`});
    }
  }
);

