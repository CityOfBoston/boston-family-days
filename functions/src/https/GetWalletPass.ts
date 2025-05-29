import {createHttpTrigger} from "../lib/functionsClient";
import {registrationDataRef} from "../lib/firestoreClient";
import {PKPass} from "passkit-generator";
import * as path from "path";
import * as admin from "firebase-admin";
import * as fs from "fs";

// Load model files as buffers at cold start
const modelDir = path.resolve(__dirname, "../assets/pass-model");
const modelFiles = [
  "icon.png",
  "icon@2x.png",
  "logo.png",
  "strip.png",
  "pass.json",
];
const modelBuffers: Record<string, Buffer> = {};
for (const file of modelFiles) {
  try {
    modelBuffers[file] = fs.readFileSync(path.join(modelDir, file));
  } catch (err) {
    console.error(`[GetWalletPass] Error loading model file: ${file}`, err);
    // Optionally, throw or handle missing files
  }
}

const signerCert = fs.readFileSync(path.join(modelDir, "cert.pem"));
const signerKey = fs.readFileSync(path.join(modelDir, "key.pem"));
const wwdr = fs.readFileSync(path.join(modelDir, "wwdr.pem"));

// Debug: Log pass.json buffer and contents
console.log("[GetWalletPass] pass.json buffer exists:",
  !!modelBuffers["pass.json"]);
if (modelBuffers["pass.json"]) {
  console.log("[GetWalletPass] pass.json contents:",
    modelBuffers["pass.json"].toString());
}

/* The function is used to generate and download a .pkpass file
 * for a given pass ID.
 * The function first checks if the pass ID is present in the registrationData
 * collection. If the pass ID is present, the function generates a .pkpass
 * file with the following custom fields that should be displayed if a
 * digital wallet app such as Apple Wallet or Google Wallet is used to display
 * the pass:
 * - Student first name
 * - Student last name
 * - School name
 * - Pass ID
 * - Email address
 * The value of these custom fields are taken from the registrationData
 * collection entry that matches the PassID. If the PassID is not found,
 * the function returns a 404 error.
 * The function then drops the generated .pkpass into firestore storage bucket
 * called "bfd-digital-pass", using the PassID as the folder name.
 * The function then redirects the user to the signed URL of the .pkpass file
 * so that it is automatically downloaded by the user's browser.
 * For the the current POC sprint, this .pkpass will not be signed by Apple or
 * Google. So only a limited number of devices with Google Wallet will be able
 * to display the pass.
*/
export const getWalletPass = createHttpTrigger(
  "public",
  async (req, res) => {
    try {
      console.log("[GetWalletPass] Request received", {query: req.query});
      const passId = req.query.passId as string;
      if (!passId) {
        console.error("[GetWalletPass] No passId provided in query");
        res.status(400).send("Missing passId");
        return;
      }
      // Get registration data using registrationDataRef
      console.log("[GetWalletPass] Querying Firestore for passId", passId);
      const querySnapshot = await registrationDataRef
        .where("passId", "==", passId)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        console.warn("[GetWalletPass] Pass not found in Firestore", {passId});
        res.status(404).send("Pass not found");
        return;
      }

      const registration = querySnapshot.docs[0].data();
      console.log("[GetWalletPass] Registration data found", registration);
      console.log("[GetWalletPass] Creating PKPass instance (buffer model)");
      const pass = new PKPass(
        modelBuffers,
        {
          signerCert: signerCert,
          signerKey: signerKey,
          wwdr: wwdr,
        },
        {
          serialNumber: passId,
          description: "Event Pass",
          organizationName: "Boston Family Days",
          passTypeIdentifier: "pass.boston-family-days",
          teamIdentifier: "GSXKSW4688",
        }
      );

      // Debug: Log PKPass instance keys and type
      console.log("[GetWalletPass] PKPass instance keys:", Object.keys(pass));
      console.log("[GetWalletPass] PKPass type property:", (pass as any).type);

      // Set pass fields using the passkit-generator API
      console.log("[GetWalletPass] Setting pass fields using dynamic getters");
      pass.headerFields.push({
        key: "passId",
        label: "Pass ID",
        value: passId,
      });
      pass.primaryFields.push({
        key: "name",
        label: "Student Name",
        value: `${registration.firstName} ${registration.lastName}`,
      });
      pass.secondaryFields.push(
        {
          key: "school",
          label: "School",
          value: registration.school,
        },
        {
          key: "email",
          label: "Email",
          value: registration.email,
        }
      );

      // Set barcode
      console.log("[GetWalletPass] Setting barcode");
      pass.setBarcodes({
        message: passId,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1",
      });

      // Generate the pass
      console.log("[GetWalletPass] Generating pkpass buffer");
      const pkpassBuffer = await pass.getAsBuffer();

      // Get reference to the storage bucket
      const bucket = admin.storage().bucket("bfd-digital-pass");
      const filePath = `passes/${passId}/pass.pkpass`;
      const file = bucket.file(filePath);

      // Upload the buffer
      console.log("[GetWalletPass] Uploading pkpass to storage", {filePath});
      await file.save(pkpassBuffer, {
        metadata: {
          contentType: "application/vnd.apple.pkpass",
        },
      });

      // Generate a signed URL that expires in 1 hour
      console.log("[GetWalletPass] Generating signed URL");
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      console.log("[GetWalletPass] Redirecting to signed URL", {signedUrl});
      res.redirect(signedUrl);
    } catch (error) {
      console.error("[GetWalletPass] Error generating pass:", error);
      res.status(500).send("Error generating pass");
    }
  }
);
