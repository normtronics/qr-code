# Dynamic QR Code Manager

A web application that allows you to create QR codes with dynamically changeable URLs. Unlike traditional QR codes that are static, this app creates QR codes that point to short URLs which can redirect to different destinations without changing the QR code itself.

## Features

- **Dynamic URL Management**: Create QR codes that can redirect to different URLs without regenerating the code
- **QR Code Generation**: Generate high-quality QR codes with customizable appearance
- **Click Tracking**: Monitor how many times each QR code has been scanned
- **Easy Management**: Simple web interface to create, edit, and delete QR codes
- **Download QR Codes**: Download generated QR codes as PNG images
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

1. **Create a QR Code**: Enter a name and target URL
2. **Get a Short URL**: The system generates a unique short URL (e.g., `yoursite.com/r/abc123`)
3. **QR Code Generation**: A QR code is created pointing to the short URL
4. **Dynamic Redirects**: When scanned, the QR code redirects to your target URL
5. **Update Anytime**: Change the target URL without changing the QR code

## Technologies Used

- **Remix**: Full-stack React framework
- **Prisma**: Database ORM with SQLite
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **QRCode.js**: QR code generation library
- **Nanoid**: Unique ID generation

## Installation

### Development Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd qr-code
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up development environment:
   ```bash
   # Make the setup script executable
   chmod +x scripts/setup-dev.sh
   
   # Run the setup script
   ./scripts/setup-dev.sh
   ```
   
   Or manually:
   ```bash
   # Create .env file
   echo 'DATABASE_URL="file:./dev.db"' > .env
   
   # Setup SQLite database for development
   npx prisma db push --schema=prisma/schema.dev.prisma
   npx prisma generate --schema=prisma/schema.dev.prisma
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Vercel Deployment

1. **Prerequisites:**
   - Vercel account
   - GitHub repository with your code

2. **Database Setup:**
   - Go to your Vercel dashboard
   - Navigate to Storage → Create Database → Postgres
   - Create a new PostgreSQL database
   - Copy the connection strings

3. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard:
     ```
     DATABASE_URL=<your-vercel-postgres-url>
     DIRECT_URL=<your-vercel-postgres-direct-url>
     ```
   - Deploy!

4. **Alternative: Vercel CLI deployment:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   
   # Set environment variables
   vercel env add DATABASE_URL
   vercel env add DIRECT_URL
   
   # Redeploy with environment variables
   vercel --prod
   ```

## Usage

### Creating a QR Code

1. Enter a descriptive name for your QR code
2. Enter the target URL where you want the QR code to redirect
3. Click "Create QR Code"
4. Your QR code will be generated and added to the list

### Managing QR Codes

- **View QR Code**: Click "Show QR" to display the QR code
- **Download**: Click "Download QR Code" to save the image
- **Edit URL**: Click "Edit URL" to change where the QR code redirects
- **Delete**: Click "Delete" to remove the QR code permanently

### Scanning QR Codes

When someone scans your QR code:
1. They'll be redirected to your target URL
2. The click count will increment automatically
3. You can see analytics in your dashboard

## Database Schema

The app uses a simple SQLite database with the following structure:

```prisma
model QRCode {
  id          String   @id @default(cuid())
  name        String
  shortCode   String   @unique
  targetUrl   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  clickCount  Int      @default(0)
}
```

## API Routes

- `GET /` - Main dashboard
- `GET /r/:shortCode` - Redirect route for QR codes
- `POST /` - Create, update, or delete QR codes

## Development

### Project Structure

```
app/
├── lib/
│   ├── db.server.ts     # Database connection
│   └── qr.server.ts     # QR code business logic
├── routes/
│   ├── _index.tsx       # Main dashboard
│   └── r.$shortCode.tsx # Redirect handler
├── root.tsx             # App root component
└── tailwind.css         # Styles
```

### Building for Production

```bash
npm run build
npm start
```

## Use Cases

- **Marketing Campaigns**: Create QR codes for campaigns and update destinations without reprinting
- **Event Management**: Direct attendees to different pages throughout an event
- **Product Packaging**: Update product information links without changing packaging
- **Restaurant Menus**: Switch between different menu versions seasonally
- **Real Estate**: Update property listing links on printed materials

## Security Considerations

- URLs are validated before storage
- Short codes are randomly generated to prevent guessing
- No user authentication is implemented (add as needed)
- Database uses SQLite for simplicity (consider PostgreSQL for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
