import * as functions from "firebase-functions";
import {syncSubscribers} from "../lib/firestoreClient";

export const syncUpaknee = functions.https.onRequest(
  {timeoutSeconds: 1800},
  async (req, res) => {
    try {
      await syncSubscribers();
      functions.logger.info("Sync with Upaknee completed successfully.");
      res.status(200).send({status: "success"});
    } catch (error) {
      functions.logger.error("Error syncing with Upaknee:", error);
      res.status(500).send({error: "Internal Server Error"});
    }
  }
);
