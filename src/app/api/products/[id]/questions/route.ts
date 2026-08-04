import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await request.json();
    const { authorName, question } = body;

    if (!authorName || !question) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const questionRecord = await prisma.question.create({
      data: {
        productId,
        authorName,
        question,
      },
    });

    return NextResponse.json(questionRecord, { status: 201 });
  } catch (error) {
    console.error("Failed to create question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
