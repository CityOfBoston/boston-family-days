import * as admin from "firebase-admin";
import {Request, Response} from "express";
import {validateLimit, createHttpTrigger} from "../lib/functionsClient";
import {constructQueryWithDateFilters,
  handlePagination,
  processFirestoreDocuments,
} from "../lib/firestoreClient";

export const getDemographicData = createHttpTrigger(
  "private",
  async (req: Request, res: Response) => {
    try {
      const {date, startDate, endDate, pageToken} = req.query;
      const limitInput = req.query.limit as string;
      const limit = validateLimit(limitInput);

      if (limit === null) {
        res.status(400).send("Invalid limit parameter");
        return;
      }

      const firestore = admin.firestore();
      const query = constructQueryWithDateFilters(
        firestore.collection("demographicData"),
        date as string,
        startDate as string,
        endDate as string
      );

      const {query: paginatedQuery, nextPageToken} =
      await handlePagination(query, limit, pageToken as string);

      const snapshot = await paginatedQuery.get();
      const bookings = processFirestoreDocuments(snapshot, limit);

      res.json({bookings, nextPageToken});
    } catch (error) {
      console.error("Error fetching demographic data:", error);
      res.status(500).json({error: `Internal Server Error: ${error}`});
    }
  }
);
