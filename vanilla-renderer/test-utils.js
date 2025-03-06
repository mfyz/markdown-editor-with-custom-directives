function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(`❌ ${message}`)
    console.error('Expected:', expected)
    console.error('Actual:', actual)
    throw new Error('Test failed')
  }
  console.log(`✅ ${message}`)
}

module.exports = { assertEqual }
