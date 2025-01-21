import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";

const ALLOWED_IPS = [
  "35.171.100.200/29",
  "18.207.171.255",
  "34.198.242.0",
  "34.192.122.37",
  "34.237.119.77",
  "35.153.38.203",
  "52.202.119.255",
  "73.89.158.66", // Testing Home IPv4
  "140.241.241.223" // Testing City IPv4
];

const API_TOKEN = process.env.EXTERNAL_API_TOKEN!;

// Helper function to check if an IP is allowed
const isIpAllowed = (ip: string): boolean => {
  const allowed = ALLOWED_IPS.some((allowedIp) =>
    ip.startsWith(allowedIp.split("/")[0]));
  return allowed;
};

// Helper function to validate the API key inline
const validateApiKey = (req: Request, apiKey: string): boolean => {
  const providedApiKey = req.headers["x-api-key"];
  return providedApiKey === apiKey;
};

// Define the function
export const getDemographicData = onRequest(
  async (req: Request, res: Response) => {
    try {
    // IP Validation
      const clientIp = req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress || "";
      if (!isIpAllowed(clientIp as string)) {
        res.status(403).json({error: "Access denied: IP not allowed"});
        return;
      }

      // API Key Validation
      if (!validateApiKey(req, API_TOKEN)) {
        res.status(403).json({error: "Invalid API key"});
        return;
      }

      const limit = req.query.limit ?
        parseInt(req.query.limit as string, 10) : null;
      if (limit !== null && (isNaN(limit) || limit <= 0)) {
        res.status(400).json(
          {
            error:
            "Invalid limit parameter. Must be positive integer or omitted.",
          }
        );
        return;
      }

      // Query the Firestore collection
      const firestore = admin.firestore();
      let query = firestore.collection("demographicData")
        .orderBy("createdAt", "asc");

      // Apply limit if provided
      if (limit !== null) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();

      // Map the data to a JSON array
      const demographicData = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt ?
            data.createdAt.seconds : null,
        };
      });

      // Respond with the data
      res.status(200).json({demographicData});
    } catch (error) {
      console.error("Error fetching registration data:", error);
      res.status(500).json({error: `Internal Server Error: ${error}`});
    }
  });
