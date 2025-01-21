import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

const db = admin.firestore();

// Webhook Listener
export const webhookHandler = onRequest(async (req, res) => {
  try {
    // Validate that it's a POST request
    if (req.method !== "POST") {
      res.status(405).send({
        message: "Method Not Allowed. Use POST only.",
      });
      return;
    }

    // Parse webhook payload from Upaknee
    const payload = req.body;
    console.log("Webhook Payload:", payload);

    const {
      profile_id: profileId,
      email,
      newsletter_id: newsletterId,
      event,
      time,
    } = payload;

    // Validate required fields from webhook payload
    if (!profileId || !email || !newsletterId || !event || !time) {
      res.status(400).send({
        message: "Missing required fields in webhook payload.",
      });
      return;
    }

    console.log("Webhook Received:", {
      profileId,
      email,
      newsletterId,
      event,
      time,
    });

    // Determine the new status based on the event
    let newStatus: string;
    if (event === "subscribe") {
      newStatus = "active";
    } else if (event === "unsubscribe") {
      newStatus = "unsubscribed";
    } else {
      console.warn(`Unhandled event type: ${event}`);
      res.status(400).send({
        message: `Unhandled event type: ${event}`,
      });
      return;
    }

    // Firestore Logic: Update all records with the given email
    const registrationRef = db.collection("registrationData");
    const snapshot = await registrationRef.where("email", "==", email).get();

    if (snapshot.empty) {
      console.log(`No records found for email: ${email}`);
      res.status(404).send({
        message: "No matching records found for the given email.",
      });
      return;
    }

    const batch = db.batch();

    snapshot.forEach((doc) => {
      console.log(`Updating document ${doc.id} with status: ${newStatus}`);
      batch.update(doc.ref, {status: newStatus});
    });

    // Commit the batch operation
    await batch.commit();

    console.log(
      `Successfully updated status to '${newStatus}' for email: ${email}`
    );

    // Respond with success
    res.status(200).send({
      message:
      `Webhook processed successfully. Status updated to '${newStatus}'.`,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Error processing webhook:", errorMessage);

    // Send proper error response
    res.status(500).send({
      message: "An error occurred while processing the webhook.",
      error: errorMessage,
    });
  }
});
