import type { LoaderFunctionArgs } from "@remix-run/node";
import { generateQRCodeTransparent } from "~/lib/qr.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");
  
  if (!targetUrl) {
    return new Response("URL parameter is required", { status: 400 });
  }
  
  try {
    const transparentPngDataURL = await generateQRCodeTransparent(targetUrl);
    
    // Convert data URL to buffer
    const base64Data = transparentPngDataURL.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=qr-code-transparent.png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Failed to generate transparent QR code", { status: 500 });
  }
} 