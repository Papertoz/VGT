const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require("../../vgtai-4c025-firebase-adminsdk-fbsvc-a8888cf71f.json");

const app = initializeApp({
  credential: cert(serviceAccount)
});

module.exports = getAuth(app);
