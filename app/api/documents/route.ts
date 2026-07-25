import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const createDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const validationResult = createDocumentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid document information",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title:
          validationResult.data.title ??
          "Untitled document",
        ownerId: currentUser.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Document created successfully",
        document: {
          ...document,
          role: "OWNER",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create document error:", error);

    return NextResponse.json(
      { error: "Unable to create document" },
      { status: 500 }
    );
  }
}

// return all documents of the current user.
export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          {
            ownerId: currentUser.id,
          },
          {
            permissions: {
              some: {
                userId: currentUser.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          where: {
            userId: currentUser.id,
          },
          select: {
            role: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const accessibleDocuments = documents.map((document) => ({
      id: document.id,
      title: document.title,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      role:
        document.ownerId === currentUser.id
          ? "OWNER"
          : document.permissions[0]?.role,
    }));

    return NextResponse.json({
      documents: accessibleDocuments,
    });
  } catch (error) {
    console.error("List documents error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve documents" },
      { status: 500 }
    );
  }
}