/**
 * Calculates the SHA-256 hash of the given input string.
 *
 * @param {string} input - The string to be hashed using the SHA-256 algorithm.
 * @return {Promise<string>} A promise that resolves to the SHA-256 hash of the input string represented as a
 *   hexadecimal string.
 */

async function calculateSHA256(input) {
  // Encode the string as a Uint8Array
  const data = new TextEncoder().encode(input);

  // Berechne den SHA-256-Hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Konvertiere das ArrayBuffer-Ergebnis in einen hexadezimalen String
  return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Decodes a Base64-encoded string into a JSON object.
 *
 * @param {string} base64String - The Base64-encoded string to be decoded.
 * @return {Object|null} The decoded JSON object if successful, or null if an error occurs during decoding or parsing.
 */
function decodeBase64ToJson(base64String) {
  try {
    const jsonString = atob(base64String);
    return JSON.parse(jsonString);
  }
  catch (error) {
    console.error('Fehler beim Dekodieren des Base64-Strings:', error);
    return null;
  }
}


/**
 * Extracts and validates game data from the provided data object. Verifies the integrity of the data using a SHA-256
 * hash and decodes it from Base64 to JSON format. Throws an error if the data integrity check fails or if any other
 * error occurs.
 *
 * @param {Object} gp - The game data object containing the data and metadata.
 * @param {string} gp.data - The Base64-encoded game data.
 * @param {Object} gp.meta - The metadata object containing additional information.
 * @param {string} gp.meta.signature - The expected SHA-256 hash signature of the game data.
 * @return {Object} - Returns the decoded game data as a JSON object.
 * @throws {Error} - Throws an error if the hash validation fails or an unexpected error occurs during processing.
 */
async function extractGamedata(gp) {
  const hash = await calculateSHA256(gp.data);

  if (hash !== gp.meta.signature) {
    console.error('Invalid signature', hash, gp.meta.signature);
    throw ('Die Datei scheint beschädigt zu sein und kann deshalb nicht geladen werden.');
  }
  return decodeBase64ToJson(gp.data);
}

/**
 * The GameplayImporter class is responsible for importing and processing gameplay data
 * from a JSON string input. It parses the provided JSON data and extracts the necessary
 * game-related metadata and properties asynchronously. The class also handles potential
 * errors during data extraction and informs the user accordingly.
 */
class GameplayImporter {
  constructor() {
    this.error = null;
  }

  /**
   * Asynchronously loads and processes game data from the provided JSON input.
   *
   * @param {string} json - The JSON string containing the game data to be loaded.
   * @return {Promise<void>} Resolves when the data is successfully loaded, or sets an error message if the version is
   *   unsupported.
   */
  async loadData(json) {
    let gp = JSON.parse(json);

    if (gp.version !== 1) {
      this.error = 'Die Dateiversion wird nicht unterstützt';
      return;
    }

    this.meta = gp.meta;
    let data  = await extractGamedata(gp);
    console.log('Data loaded', data);
    this.gameplay   = data.gameplay;
    this.properties = data.properties;

    return {
      gameplay:   this.gameplay,
      properties: this.properties,
      meta:       this.meta
    }
  }
}


export {GameplayImporter};
