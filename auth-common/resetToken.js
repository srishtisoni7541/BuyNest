const crypto = require("crypto");

function generateResetToken() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiresAt = Date.now() + 15 * 60 * 1000; 
  return { resetToken, hashedToken, expiresAt };
}

module.exports = generateResetToken;
