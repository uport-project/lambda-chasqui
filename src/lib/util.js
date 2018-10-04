const crypto = require('crypto')

const BYTELEN = 12

/**
 * Create a random, url-safe, 16-character, base64 encoded string
 */
function randomString() {
  return crypto.randomBytes(BYTELEN)
    .toString('base64')
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

module.exports = { randomString }