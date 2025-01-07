import * as jose from 'jose';

type SignJwtOptions = {
  algorithm: string;
  expiresIn: string | number;
  issuer: string;
  header: jose.JWTHeaderParameters;
};

async function signJwt(
  payload: jose.JWTPayload,
  key: string,
  options: SignJwtOptions,
): Promise<string> {
  const ecPrivateKey = await jose.importPKCS8(key, options.algorithm);
  return await new jose.SignJWT(payload)
    .setProtectedHeader(options.header)
    .setIssuedAt()
    .setIssuer(options.issuer)
    .setExpirationTime(options.expiresIn)
    .sign(ecPrivateKey);
}

export type DeveloperKeyCredentials = {
  privateKey?: string;
  teamId?: string;
  keyId?: string;
};

export async function createDeveloperKey(
  credentials: DeveloperKeyCredentials,
): Promise<string> {
  if (!credentials?.privateKey || !credentials?.teamId || !credentials?.keyId) {
    throw new Error('Invalid credentials');
  }

  return signJwt({}, credentials.privateKey, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: credentials.teamId,
    header: {
      alg: 'ES256',
      kid: credentials.keyId,
    },
  });
}
