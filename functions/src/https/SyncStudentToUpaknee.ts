import {Request, Response} from "express";
import {createHttpTrigger} from "../lib/functionsClient";
import {getStudentEmail, syncEmailGroup} from "../lib/firestoreClient";

export const syncStudentToUpaknee = createHttpTrigger(
  "private",
  async (req: Request, res: Response) => {
    try {
      const {passId} = req.query;

      // Validate that passId is provided
      if (!passId) {
        res.status(400).json({
          error: "'passId' query parameter is required",
        });
        return;
      }

      // Get the email for this passId
      let emailToSync: string;
      try {
        emailToSync = await getStudentEmail(passId as string);
      } catch (error) {
        if (error instanceof Error &&
          error.message.includes("No student found")) {
          res.status(404).json({error: error.message});
          return;
        }
        throw error;
      }

      // Sync the email group (all students for this email)
      const studentCount = await syncEmailGroup(emailToSync);

      res.status(200).json({
        status: "success",
        message: `Successfully synced ${studentCount} student(s) to Upaknee`,
        email: emailToSync,
        studentCount,
      });
    } catch (error) {
      console.error("Error syncing student to Upaknee:", error);
      if (error instanceof Error) {
        if (error.message.includes("No records found")) {
          res.status(404).json({error: error.message});
          return;
        }
        if (error.message.includes("Failed to retrieve profile ID")) {
          res.status(500).json({
            error: "Failed to sync with Upaknee service",
            details: error.message,
          });
          return;
        }
      }
      res.status(500).json({error: `Internal Server Error: ${error}`});
    }
  }
);

