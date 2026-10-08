import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { UPLOAD_PREFIX, isOwner } from "@/app/krillion/store";

export async function POST(request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await handleUpload({
      request,
      body: await request.json(),
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(UPLOAD_PREFIX)) throw new Error("Invalid path");
        return {
          allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
