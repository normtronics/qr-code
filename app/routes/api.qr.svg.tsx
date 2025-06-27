import type { LoaderFunctionArgs } from "@remix-run/node";
import { generateQRCodeSVG } from "~/lib/qr.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");
  
  if (!targetUrl) {
    return new Response("URL parameter is required", { status: 400 });
  }
  
  try {
    const svgContent = await generateQRCodeSVG(targetUrl);
    
    return new Response(svgContent, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": "attachment; filename=qr-code.svg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Failed to generate QR code", { status: 500 });
  }
} 