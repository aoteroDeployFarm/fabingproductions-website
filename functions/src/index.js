const { onRequest } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')

initializeApp()

// Health check — extend this file for server-side logic (contact form, webhooks, etc.)
exports.health = onRequest((req, res) => {
  res.json({ status: 'ok', project: 'fabing-productions' })
})
