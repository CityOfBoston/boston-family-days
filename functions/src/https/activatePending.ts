import {createHttpTrigger} from "../lib/functionsClient";
import {registrationDataRef} from "../lib/firestoreClient";
import {activateSubscriber} from "../lib/upakneeClient";

/**
 * Goes through all subscribers in the registrationData collection
 * and activates them if they have a status of "pending". Catches
 * any errors if Upaknee cannot active them and logs the error
 * alongside the subscriber's email, this is a non-blocking
 * operation. If the activation is successful, the subscriber's
 * status is updated to "active". Otherwise, the subscriber's
 * status is not updated. If the subscriber's status is not
 * "pending", the subscriber is skipped.
 */
export const activatePending = createHttpTrigger(
  "protected",
  async (req, res) => {
    try {
    // Get all subscribers with "pending" status
      const snapshot = await registrationDataRef.where(
        "status", "==", "pending")
        .get();

      if (snapshot.empty) {
        console.log("No pending subscribers found");
        res.status(200).json({message: "No pending subscribers found"});
        return;
      }

      console.log(`Found ${snapshot.size} pending subscribers`);

      const results: {
      total: number;
      activated: number;
      failed: number;
      errors: Array<{ email: string; error: string }>;
    } = {
      total: snapshot.size,
      activated: 0,
      failed: 0,
      errors: [],
    };

      // Process each pending subscriber
      const activationPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const {email, profileId} = data;

        // Skip subscribers without a profileId
        if (!profileId) {
          console.log(
            `Subscriber ${email} doesn't have a profileId, skipping`);
          results.failed++;
          results.errors.push({email, error: "No profileId found"});
          return;
        }

        try {
        // Activate subscriber via Upaknee
          await activateSubscriber(profileId);

          // Update subscriber status to "active"
          await doc.ref.update({status: "active"});

          console.log(`Successfully activated subscriber: ${email}`);
          results.activated++;
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ?
            error.message : "Unknown error";
          console.error(`Failed to activate subscriber ${email}:`, error);
          results.failed++;
          results.errors.push({email, error: errorMessage});
        }
      });

      // Wait for all activation attempts to complete
      await Promise.all(activationPromises);

      console.log(`Activation complete: ${results.activated

      } activated, ${results.failed} failed`);
      res.status(200).json(results);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message :
        "Unknown error";
      console.error("Error activating pending subscribers:", error);
      res.status(500).json({
        error: "Failed to process pending subscribers",
        details: errorMessage,
      });
    }
  });


