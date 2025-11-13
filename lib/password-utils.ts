// Common password list (abbreviated)
const commonPasswords = [
  "password",
  "123456",
  "qwerty",
  "admin",
  "welcome",
  "123456789",
  "12345678",
  "abc123",
  "football",
  "monkey",
  "letmein",
  "dragon",
  "baseball",
  "sunshine",
  "princess",
  "password123",
  "qwerty123",
  "admin123",
  "iloveyou",
  "1234567890",
]

interface StrengthResult {
  score: number
  entropy: number
  feedback: string[]
}

export function calculatePasswordStrength(password: string): StrengthResult {
  const feedback: string[] = []
  let score = 0

  // Check if password is common
  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push("This is a commonly used password")
    return { score: 0, entropy: 0, feedback }
  }

  // Calculate base score based on length
  if (password.length < 8) {
    feedback.push("Password is too short (minimum 8 characters)")
  } else {
    score += 1
  }

  if (password.length >= 12) {
    score += 1
  }

  if (password.length >= 16) {
    score += 1
  }

  // Check for character variety
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[^A-Za-z0-9]/.test(password)

  let varietyCount = 0
  if (hasLowercase) varietyCount++
  if (hasUppercase) varietyCount++
  if (hasNumbers) varietyCount++
  if (hasSpecialChars) varietyCount++

  score += Math.min(varietyCount, 3)

  // Check for patterns and repetitions
  const hasRepeatedChars = /(.)\1{2,}/.test(password) // Same character 3+ times in a row
  const hasSequentialNumbers = /(012|123|234|345|456|567|678|789)/.test(password)
  const hasSequentialLetters =
    /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)

  if (hasRepeatedChars) {
    score = Math.max(0, score - 1)
    feedback.push("Avoid repeated characters (e.g., 'aaa')")
  }

  if (hasSequentialNumbers || hasSequentialLetters) {
    score = Math.max(0, score - 1)
    feedback.push("Avoid sequential patterns (e.g., '123', 'abc')")
  }

  // Add feedback based on missing character types
  if (!hasLowercase) feedback.push("Add lowercase letters (a-z)")
  if (!hasUppercase) feedback.push("Add uppercase letters (A-Z)")
  if (!hasNumbers) feedback.push("Add numbers (0-9)")
  if (!hasSpecialChars) feedback.push("Add special characters (e.g., !@#$%)")

  // Calculate entropy (bits of randomness)
  let charsetSize = 0
  if (hasLowercase) charsetSize += 26
  if (hasUppercase) charsetSize += 26
  if (hasNumbers) charsetSize += 10
  if (hasSpecialChars) charsetSize += 33 // Approximate number of special chars

  const entropy = Math.log2(Math.pow(Math.max(charsetSize, 1), password.length))

  return {
    score,
    entropy,
    feedback,
  }
}

export function estimateCrackTime(entropy: number): string {
  // Assuming 10 billion guesses per second (modern hardware)
  const guessesPerSecond = 10000000000

  // Calculate seconds to crack
  const secondsToCrack = Math.pow(2, entropy) / guessesPerSecond

  if (secondsToCrack < 1) {
    return "Instantly"
  } else if (secondsToCrack < 60) {
    return `${Math.round(secondsToCrack)} seconds`
  } else if (secondsToCrack < 3600) {
    return `${Math.round(secondsToCrack / 60)} minutes`
  } else if (secondsToCrack < 86400) {
    return `${Math.round(secondsToCrack / 3600)} hours`
  } else if (secondsToCrack < 31536000) {
    return `${Math.round(secondsToCrack / 86400)} days`
  } else if (secondsToCrack < 31536000 * 100) {
    return `${Math.round(secondsToCrack / 31536000)} years`
  } else if (secondsToCrack < 31536000 * 1000) {
    return `${Math.round(secondsToCrack / 31536000 / 100)} centuries`
  } else if (secondsToCrack < 31536000 * 1000000) {
    return `${Math.round(secondsToCrack / 31536000 / 1000)} millennia`
  } else {
    return "Heat death of the universe"
  }
}

export function generatePassword(
  length = 16,
  includeLowercase = true,
  includeUppercase = true,
  includeNumbers = true,
  includeSymbols = true,
): string {
  let charset = ""

  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  if (includeNumbers) charset += "0123456789"
  if (includeSymbols) charset += "!@#$%^&*()_-+=<>?/"

  // Ensure at least one character set is selected
  if (charset === "") charset = "abcdefghijklmnopqrstuvwxyz"

  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}
