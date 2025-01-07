#!/usr/bin/env -S npx tsx

import { createDeveloperKey } from '#/lib/musickit/jwt';

async function main() {
  if (!process.env.MUSICKIT_PRIVATE_KEY) {
    throw new Error('No MUSICKIT_PRIVATE_KEY');
  }

  const privateKey = process.env.MUSICKIT_PRIVATE_KEY.replace(/\\n/g, '\n');

  const developerKey = await createDeveloperKey({
    privateKey,
    teamId: process.env.MUSICKIT_TEAM_ID,
    keyId: process.env.MUSICKIT_KEY_ID,
  });

  console.log(developerKey);
}

main().then(
  () => {
    process.exit(0);
  },
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
