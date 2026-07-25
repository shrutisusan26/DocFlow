import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const updateDocumentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),

    content: z
      .unknown()
      .refine(
        (value) =>
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value),
        "Content must be a JSON object"
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined,
    {
      message: "Provide a title or content to update",
    }
  );

async function findDocumentAccess(
  documentId: string,
  userId: string
) {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
    include: {
      permissions: {
        where: {
          userId,
        },
        select: {
          role: true,
        },
      },
    },
  });

  if (!document) {
    return null;
  }

  const role =
    document.ownerId === userId
      ? "OWNER"
      : document.permissions[0]?.role;

  if (!role) {
    return null;
  }

  return {
    document,
    role,
  };
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
    const access = await findDocumentAccess(
      id,
      currentUser.id
    );

    if (!access) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const { permissions, ...document } = access.document;

    return NextResponse.json({
      document: {
        ...document,
        role: access.role,
      },
    });
  } catch (error) {
    console.error("Read document error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve document" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const access = await findDocumentAccess(
      id,
      currentUser.id
    );

    if (!access) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (
      access.role !== "OWNER" &&
      access.role !== "EDITOR"
    ) {
      return NextResponse.json(
        { error: "You do not have permission to edit this document" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult =
      updateDocumentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid document information",
          details:
            validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updateData: Prisma.DocumentUpdateInput = {};

    if (validationResult.data.title !== undefined) {
      updateData.title = validationResult.data.title;
    }

    if (validationResult.data.content !== undefined) {
      updateData.content =
        validationResult.data
          .content as Prisma.InputJsonValue;
    }

    const document = await prisma.document.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Document updated successfully",
      document: {
        ...document,
        role: access.role,
      },
    });
  } catch (error) {
    console.error("Update document error:", error);

    return NextResponse.json(
      { error: "Unable to update document" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const document = await prisma.document.findUnique({
      where: {
        id,
      },
      select: {
        ownerId: true,
      },
    });

    if (
      !document ||
      document.ownerId !== currentUser.id
    ) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await prisma.document.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return NextResponse.json(
      { error: "Unable to delete document" },
      { status: 500 }
    );
  }
}