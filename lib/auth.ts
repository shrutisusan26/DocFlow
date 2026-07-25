import { jwtVerify, SignJWT } from "jose";

const JWT_EXPIRATION = "7d";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

type TokenPayload = {
  userId: string;
  email: string;
};

export async function createAuthToken({
  userId,
  email,
}: TokenPayload) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ["HS256"],
  });

  if (!payload.sub) {
    throw new Error("Token does not contain a user ID");
  }

  return {
    userId: payload.sub,
    email:
      typeof payload.email === "string"
        ? payload.email
        : undefined,
  };
}