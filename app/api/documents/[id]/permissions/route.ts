import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const shareDocumentSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  role: z.enum(["EDITOR", "VIEWER"]),
});

async function findOwnedDocument(
  documentId: string,
  userId: string
) {
  return prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const document = await prisma.document.findFirst({
      where: {
        id,
        ownerId: currentUser.id,
      },
      select: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        permissions: {
          select: {
            id: true,
            role: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      owner: document.owner,
      permissions: document.permissions,
    });
  } catch (error) {
    console.error("List permissions error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve document permissions" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const validationResult =
      shareDocumentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid sharing information",
          details:
            validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const ownedDocument = await findOwnedDocument(
      id,
      currentUser.id
    );

    if (!ownedDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const email =
      validationResult.data.email.toLowerCase();
    const { role } = validationResult.data;

    const targetUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          error:
            "No registered DocFlow user was found with this email",
        },
        { status: 404 }
      );
    }

    if (targetUser.id === currentUser.id) {
      return NextResponse.json(
        {
          error:
            "The document owner already has full access",
        },
        { status: 400 }
      );
    }

    const permission =
      await prisma.documentPermission.upsert({
        where: {
          documentId_userId: {
            documentId: id,
            userId: targetUser.id,
          },
        },
        update: {
          role,
        },
        create: {
          documentId: id,
          userId: targetUser.id,
          role,
        },
        select: {
          id: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      message: "Document access updated successfully",
      permission: {
        ...permission,
        user: targetUser,
      },
    });
  } catch (error) {
    console.error("Share document error:", error);

    return NextResponse.json(
      { error: "Unable to update document access" },
      { status: 500 }
    );
  }
}