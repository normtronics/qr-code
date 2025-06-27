import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation, useActionData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { 
  createQRCode, 
  getAllQRCodes, 
  updateQRCodeUrl, 
  deleteQRCode, 
  generateQRCode 
} from "~/lib/qr.server";

export const meta: MetaFunction = () => {
  return [
    { title: "QR Code Manager - Dynamic QR Codes" },
    { name: "description", content: "Create and manage dynamic QR codes with changeable URLs" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const qrCodes = await getAllQRCodes();
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  
  return json({ qrCodes, baseUrl });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  switch (intent) {
    case "create": {
      const name = formData.get("name") as string;
      const targetUrl = formData.get("targetUrl") as string;
      
      if (!name || !targetUrl) {
        return json({ error: "Name and URL are required" }, { status: 400 });
      }
      
      try {
        const qrCode = await createQRCode(name, targetUrl);
        const shortUrl = `${baseUrl}/r/${qrCode.shortCode}`;
        const qrCodeImage = await generateQRCode(shortUrl);
        
        return json({ 
          success: "QR code created successfully!",
          qrCode: { ...qrCode, qrCodeImage }
        });
      } catch (error) {
        return json({ error: "Failed to create QR code" }, { status: 500 });
      }
    }
    
    case "update": {
      const id = formData.get("id") as string;
      const targetUrl = formData.get("targetUrl") as string;
      
      if (!id || !targetUrl) {
        return json({ error: "ID and URL are required" }, { status: 400 });
      }
      
      try {
        await updateQRCodeUrl(id, targetUrl);
        return json({ success: "QR code updated successfully!" });
      } catch (error) {
        return json({ error: "Failed to update QR code" }, { status: 500 });
      }
    }
    
    case "delete": {
      const id = formData.get("id") as string;
      
      if (!id) {
        return json({ error: "ID is required" }, { status: 400 });
      }
      
      try {
        await deleteQRCode(id);
        return json({ success: "QR code deleted successfully!" });
      } catch (error) {
        return json({ error: "Failed to delete QR code" }, { status: 500 });
      }
    }
    
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
}

export default function Index() {
  const { qrCodes, baseUrl } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  const isCreating = navigation.state === "submitting" && 
                    navigation.formData?.get("intent") === "create";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dynamic QR Code Manager
          </h1>
          <p className="text-lg text-gray-600">
            Create QR codes that you can update anytime without changing the code itself
          </p>
        </div>

        {/* Alert Messages */}
        {actionData && 'error' in actionData && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {actionData.error}
          </div>
        )}
        
        {actionData && 'success' in actionData && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {actionData.success}
          </div>
        )}

        {/* Create New QR Code Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New QR Code</h2>
          <Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="create" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., My Website Link"
                />
              </div>
              <div>
                <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Target URL
                </label>
                <input
                  type="url"
                  id="targetUrl"
                  name="targetUrl"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create QR Code"}
            </button>
          </Form>
        </div>

        {/* QR Codes List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your QR Codes</h2>
          </div>
          
          {qrCodes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No QR codes created yet. Create your first one above!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {qrCodes.map((qrCode) => (
                <div key={qrCode.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {qrCode.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Short URL:</span>{" "}
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {baseUrl}/r/{qrCode.shortCode}
                          </code>
                        </p>
                        <p>
                          <span className="font-medium">Target URL:</span>{" "}
                          <a 
                            href={qrCode.targetUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {qrCode.targetUrl}
                          </a>
                        </p>
                        <p>
                          <span className="font-medium">Clicks:</span> {qrCode.clickCount}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(qrCode.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      <button
                        onClick={() => setShowQRCode(showQRCode === qrCode.id ? null : qrCode.id)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        {showQRCode === qrCode.id ? "Hide QR" : "Show QR"}
                      </button>
                      <button
                        onClick={() => setEditingId(editingId === qrCode.id ? null : qrCode.id)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit URL
                      </button>
                      <Form method="post" className="inline">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={qrCode.id} />
                        <button
                          type="submit"
                          onClick={(e) => {
                            if (!confirm("Are you sure you want to delete this QR code?")) {
                              e.preventDefault();
                            }
                          }}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </Form>
                    </div>
                  </div>

                  {/* QR Code Display */}
                  {showQRCode === qrCode.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <QRCodeDisplay 
                        shortUrl={`${baseUrl}/r/${qrCode.shortCode}`}
                        name={qrCode.name}
                      />
                    </div>
                  )}

                  {/* Edit URL Form */}
                  {editingId === qrCode.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <Form method="post" className="space-y-3">
                        <input type="hidden" name="intent" value="update" />
                        <input type="hidden" name="id" value={qrCode.id} />
                                                 <div>
                           <label htmlFor={`targetUrl-${qrCode.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                             New Target URL
                           </label>
                           <input
                             type="url"
                             id={`targetUrl-${qrCode.id}`}
                             name="targetUrl"
                             defaultValue={qrCode.targetUrl}
                             required
                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                         </div>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Update URL
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </Form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component to display QR code
function QRCodeDisplay({ shortUrl, name }: { shortUrl: string; name: string }) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const QRCode = await import('qrcode');
        const qrCodeDataURL = await QRCode.default.toDataURL(shortUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeImage(qrCodeDataURL);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [shortUrl]);

  const downloadQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.download = `${name}-qr-code.png`;
      link.href = qrCodeImage;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Generating QR code...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {qrCodeImage ? (
        <>
          <img 
            src={qrCodeImage} 
            alt={`QR Code for ${name}`}
            className="mx-auto mb-4 border border-gray-200 rounded"
          />
          <button
            onClick={downloadQRCode}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download QR Code
          </button>
        </>
      ) : (
        <p className="text-red-600">Failed to generate QR code</p>
      )}
    </div>
  );
}
