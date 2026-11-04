import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, isS3Configured } from "@/lib/s3";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if S3 is configured
    if (!isS3Configured()) {
      return NextResponse.json(
        { error: "File upload is not configured. AWS S3 credentials are required." },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const url = await uploadToS3(buffer, file.name, file.type);

    return NextResponse.json({ 
      success: true, 
      url,
      message: "Image uploaded successfully" 
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: error.message || "Upload failed" 
    }, { status: 500 });
  }
}
