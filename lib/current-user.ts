import { cookies } from "next/headers";

import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("docflow_session")?.value;

  if (!token) {
    return null;
  }

  try {
    const { userId } = await verifyAuthToken(token);

    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  } catch {
    return null;
  }
}