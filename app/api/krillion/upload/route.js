import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { UPLOAD_PREFIX, isOwner } from "@/app/krillion/store";

const ALLOWED_CONTENT_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAXIMUM_SIZE_IN_BYTES = 25 * 1024 * 1024;

export async function POST(request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await handleUploadPresigned({
      request,
      body: await request.json(),
      getSignedToken: async (pathname) => {
        if (!pathname.startsWith(UPLOAD_PREFIX)) throw new Error("Invalid path");
        const constraints = {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAXIMUM_SIZE_IN_BYTES,
        };
        return {
          token: await issueSignedToken({ ...constraints, pathname, operations: ["put"] }),
          urlOptions: { ...constraints, addRandomSuffix: true },
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
