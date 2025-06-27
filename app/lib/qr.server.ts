import QRCode from 'qrcode';
import { nanoid } from 'nanoid';
import { db } from './db.server';

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

export async function createQRCode(name: string, targetUrl: string) {
  const shortCode = nanoid(8);
  
  const qrCode = await db.qRCode.create({
    data: {
      name,
      shortCode,
      targetUrl,
    },
  });
  
  return qrCode;
}

export async function updateQRCodeUrl(id: string, targetUrl: string) {
  const qrCode = await db.qRCode.update({
    where: { id },
    data: { targetUrl },
  });
  
  return qrCode;
}

export async function getQRCode(shortCode: string) {
  const qrCode = await db.qRCode.findUnique({
    where: { shortCode },
  });
  
  if (qrCode) {
    // Increment click count
    await db.qRCode.update({
      where: { shortCode },
      data: { clickCount: { increment: 1 } },
    });
  }
  
  return qrCode;
}

export async function getAllQRCodes() {
  return await db.qRCode.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteQRCode(id: string) {
  return await db.qRCode.delete({
    where: { id },
  });
} 