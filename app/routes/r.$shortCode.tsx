import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getQRCode } from "~/lib/qr.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { shortCode } = params;
  
  if (!shortCode) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const qrCode = await getQRCode(shortCode);
  
  if (!qrCode) {
    throw new Response("QR Code not found", { status: 404 });
  }
  
  // Redirect to the target URL
  return redirect(qrCode.targetUrl, { status: 302 });
} 