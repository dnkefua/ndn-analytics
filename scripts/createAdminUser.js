/**
 * One-time script: Enable Firebase Auth Email/Password and create admin user.
 * Run: node scripts/createAdminUser.js <email> <password>
 * Delete this file after use.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

if (!EMAIL || !PASSWORD) {
  console.error('Usage: node scripts/createAdminUser.js <email> <password>');
  process.exit(1);
}

// Read Firebase CLI config to get refresh token + client ID/secret
const configPath = join(process.env.USERPROFILE || process.env.HOME, '.config', 'configstore', 'firebase-tools.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
const refreshToken = config.tokens.refresh_token;

// Exchange refresh token for access token
async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.tokens.client_id || '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
      client_secret: config.tokens.client_secret || 'j9iVZfS8kkCEFUPaAeJV0sAi',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

const PROJECT_ID = 'ndn-analytics';

async function enableEmailPassword(accessToken) {
  // Get current Identity Toolkit config
  const getRes = await fetch(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!getRes.ok) {
    // Config doesn't exist yet — need to enable Identity Platform first
    console.log('Enabling Identity Platform...');
    const enableRes = await fetch(
      `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/identityPlatform:initializeAuth`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!enableRes.ok) {
      const err = await enableRes.text();
      console.log('Identity Platform init response:', err);
    }
  }

  // Enable Email/Password sign-in provider
  const patchRes = await fetch(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config?updateMask=signIn.email`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signIn: {
          email: {
            enabled: true,
            passwordRequired: true,
          },
        },
      }),
    }
  );

  if (patchRes.ok) {
    console.log('✓ Email/Password sign-in enabled');
  } else {
    const err = await patchRes.text();
    console.log('Email/Password config response:', patchRes.status, err);
  }
}

async function createUser(apiKey) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD, returnSecureToken: true }),
    }
  );

  const data = await res.json();
  if (data.error) {
    if (data.error.message === 'EMAIL_EXISTS') {
      console.log(`✓ User ${EMAIL} already exists — ready for admin login.`);
    } else {
      console.error('Error creating user:', data.error.message);
      process.exit(1);
    }
  } else {
    console.log(`✓ Admin user created: ${data.localId} (${data.email})`);
  }
}

const API_KEY = 'AIzaSyBNzRVOK6hPkJOrLO2yyU-PE0I239V7Aes';
const accessToken = await getAccessToken();
await enableEmailPassword(accessToken);
await createUser(API_KEY);
