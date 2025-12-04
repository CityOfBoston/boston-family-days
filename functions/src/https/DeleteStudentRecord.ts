import {Request, Response} from "express";
import {createHttpTrigger} from "../lib/functionsClient";
import {deleteStudentByPassId, syncEmailGroup} from "../lib/firestoreClient";

export const deleteStudentRecord = createHttpTrigger(
  "private",
  async (req: Request, res: Response) => {
    try {
      const {passId} = req.body;

      if (!passId) {
        res.status(400).json({error: "passId is required in request body"});
        return;
      }

      // Delete the student record (this returns the email before deletion)
      const deletionResult = await deleteStudentByPassId(passId);
      const email = deletionResult.email;

      // Sync remaining students for this email group to Upaknee
      // This ensures deleted student slots are cleared in Upaknee
      let syncResult;
      try {
        const studentCount = await syncEmailGroup(email);
        syncResult = {
          success: true,
          studentCount,
          message: `Synced ${studentCount} remaining student(s) to Upaknee`,
        };
      } catch (syncError) {
        // Log sync error but don't fail the deletion
        console.error(
          `Student deleted but sync to Upaknee failed for email ${email}:`,
          syncError
        );
        syncResult = {
          success: false,
          error: syncError instanceof Error ? syncError.message :
            String(syncError),
          message: "Student deleted but sync to Upaknee failed",
        };
      }

      res.status(200).json({
        status: "success",
        message: "Student record deleted successfully",
        passId,
        deletedDocuments: {
          registration: deletionResult.registrationDocIds,
          demographic: deletionResult.demographicDocIds,
        },
        upakneeSync: syncResult,
      });
    } catch (error) {
      console.error("Error deleting student record:", error);
      if (error instanceof Error) {
        if (error.message.includes("student not found") ||
            error.message.includes("No student found")) {
          res.status(404).json({error: error.message});
          return;
        }
      }
      res.status(500).json({error: `Internal Server Error: ${error}`});
    }
  }
);

