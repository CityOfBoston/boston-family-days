import axios from "axios";
import * as xml2js from "xml2js";
import {StudentSubscriberData} from "./types";

/**
 * Imports Upaknee API credentials and endpoints.
 */
const API_TOKEN = process.env.UPAKNEE_API_TOKEN!;
const API_PASSWORD = process.env.UPAKNEE_API_PASSWORD!;
const NEWSLETTER_ID = process.env.UPAKNEE_API_NEWSLETTER_ID;
const SUBSCRIBERS_ENDPOINT = `${process.env.UPAKNEE_API_ENDPOINT}/subscribers/`;
const PREFIXES = ["first", "second", "third", "fourth", "fifth",
  "sixth", "seventh", "eighth"];

/**
 * Adds a subscriber to the Upaknee email newsletter email service.
 * @param {Subscriber} subscriber - The subscriber to add.
 * @param {string} email - The email address of the subscriber.
 * @param {number} index - The index of the subscriber, starting from 0.
 * @param {boolean} suppressConfirmation - Whether to suppress confirmation.
 * @return {Promise<string>} The profile ID of the subscriber.
 * @throws Will throw an error if the profile ID cannot be retrieved.
 */
export const addSingleSubscriber = async (
  subscriber: StudentSubscriberData,
  email: string,
  index: number,
  suppressConfirmation = false
): Promise<string> => {
  console.log(`Adding single subscriber: ${email}, index: ${index}`);
  const {passId, firstName, lastName, school} = subscriber;
  if (index < 0 || index > 7) {
    console.error("Invalid index");
    throw new Error("Invalid index");
  }
  const prefix = PREFIXES[index];
  const xmlData = `
<subscriber>
  <email>${email}</email>
  <update-existing>true</update-existing>
  ${suppressConfirmation ?
    `<suppress-confirmation>true</suppress-confirmation>
    <status>active</status>` :
    "<suppress-confirmation>false</suppress-confirmation>"}
  <${prefix}-student-pass-id>` +
  `${passId}</${prefix}-student-pass-id>
  <${prefix}-student-first-name>` +
  `${firstName}</${prefix}-student-first-name>
  <${prefix}-student-last-name>` +
  `${lastName}</${prefix}-student-last-name>
  <${prefix}-student-school-name>` +
  `${school}</${prefix}-student-school-name>
  <subscriptions>
    <subscription>
      <newsletter-id>${NEWSLETTER_ID}</newsletter-id>
    </subscription>
  </subscriptions>
</subscriber>`;

  const response = await axios.post(SUBSCRIBERS_ENDPOINT, xmlData, {
    headers: {"Content-Type": "application/xml", "Accept": "application/xml"},
    auth: {username: API_TOKEN, password: API_PASSWORD},
  });
  console.log(`Response received for single subscriber: ${email}`);

  const parsedData = await xml2js.parseStringPromise(response.data, {
    explicitArray: false,
  });
  const profileId = parsedData?.result?.["profile-id"];
  if (!profileId) {
    throw new Error("Failed to retrieve profile ID.");
  }

  console.log(`Profile ID for single subscriber: ${profileId}`);
  return profileId;
};

/**
 * Adds or updates a group of subscribers with the same email address to the
 * Upaknee email newsletter email service.
 * Taking advantage of the Upaknee API, we
 * can add multiple subscribers with one request. In this request, all the
 * available attributes 4 (passId, firstName,
 * lastName, school) * 8 (index spots)
 * must all be filled out. If the list of subscribers is less than 9, the
 * remaining attributes should be left blank but still included.
 * @param {Subscriber[]} subscribers - The subscribers to add.
 * @param {string} email - The email address of the subscribers.
 * @param {boolean} suppressConfirmation - Whether to suppress confirmation.
 * @return {Promise<string>} The profile ID shared by the subscribers.
 * @throws Will throw an error if the profile IDs cannot be retrieved.
 */
export const updateSubscriberGroup = async (
  subscribers: StudentSubscriberData[],
  email: string,
  suppressConfirmation = true
): Promise<string[]> => {
  console.log(
    `Updating subscriber group: ${email}, count: ${subscribers.length}`);
  const xmlData = `
<subscriber>
  <email>${email}</email>
  <update-existing>true</update-existing>
  ${suppressConfirmation ?
    `<suppress-confirmation>true</suppress-confirmation>
     <status>active</status>` :
    "<suppress-confirmation>false</suppress-confirmation>"}
  ${PREFIXES.map((prefix, index) => {
    const subscriber = subscribers[index] || {};
    return `
  <${prefix}-student-pass-id>` +
  `${subscriber.passId || ""}</${prefix}-student-pass-id>
  <${prefix}-student-first-name>` +
  `${subscriber.firstName || ""}</${prefix}-student-first-name>
  <${prefix}-student-last-name>` +
  `${subscriber.lastName || ""}</${prefix}-student-last-name>
  <${prefix}-student-school-name>` +
  `${subscriber.school || ""}</${prefix}-student-school-name>
  `;
  }).join("")}
  <subscriptions>
    <subscription>
      <newsletter-id>${NEWSLETTER_ID}</newsletter-id>
    </subscription>
  </subscriptions>
</subscriber>`;
  const response = await axios.post(SUBSCRIBERS_ENDPOINT, xmlData, {
    headers: {"Content-Type": "application/xml", "Accept": "application/xml"},
    auth: {username: API_TOKEN, password: API_PASSWORD},
  });
  console.log(`Response received for subscriber group: ${email}`);

  const parsedData = await xml2js.parseStringPromise(response.data, {
    explicitArray: false,
  });
  const profileId = parsedData?.result?.["profile-id"];
  if (!profileId) {
    throw new Error("Failed to retrieve profile ID.");
  }

  console.log(`Profile ID for subscriber group: ${profileId}`);
  return profileId;
};
