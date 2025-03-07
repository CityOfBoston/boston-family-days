/**
 * Generates a random 5-character ID combination containing
 * uppercase letters and numbers.
 * @return {string} A 5-character ID.
 */
export const generateFiveDigitId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

/**
 * Sanitizes string for XML and firestore compatability by
 * replacing special characters with spaces and merging
 * consecutive spaces into one.
 * @param {string} str The string to sanitize.
 * @return {string} The sanitized string.
 */
export const sanitizeString = (str: string | null | undefined) => {
  // Handle null or undefined values
  if (str === null || str === undefined) {
    return "";
  }

  return str
    .trim()
    .replace(/[^\w\s-]/g, " ") // Replace special characters with spaces
    .replace(/\s+/g, " ") // Merge consecutive spaces into one
    .trim(); // Trim leading and trailing spaces
};

/**
 * Sanitizes school name for XML and firestore compatability by
 * removing "Other:" prefix if present, converting to
 * lowercase, trimming the sequence then replacing special
 * characters with spaces and merging consecutive spaces
 * into one, then replacing spaces with dashes.
 * @param {string} str The string to sanitize.
 * @return {string} The sanitized string.
 */
export const sanitizeSchoolName = (str: string | null | undefined) => {
  // Handle null or undefined values
  if (str === null || str === undefined) {
    return "";
  }

  return str
    .trim()
    .toLowerCase()
    .replace(/other: /i, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
};
