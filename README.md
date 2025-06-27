# Dynamic QR Code Manager

A web application that allows you to create QR codes with dynamically changeable URLs. Unlike traditional QR codes that are static, this app creates QR codes that point to short URLs which can redirect to different destinations without changing the QR code itself.

## Features

- **Dynamic URL Management**: Create QR codes that can redirect to different URLs without regenerating the code
- **Multiple Format Support**: Download QR codes as PNG, transparent PNG, or SVG formats
- **Click Tracking**: Monitor how many times each QR code has been scanned
- **Easy Management**: Simple web interface to create, edit, and delete QR codes
- **Bulk Downloads**: Download all QR codes at once in ZIP archives
- **Transparent PNGs**: Perfect for overlaying on different backgrounds
- **Scalable SVGs**: Vector format ideal for print and high-resolution displays
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

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd qr-code
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   npm run setup
   # Then edit .env with your database URL
   ```

4. Set up the database:
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Database Configuration

### Local Development
- **PostgreSQL**: Update `.env` with your PostgreSQL connection string
- **SQLite**: Change `provider` in `prisma/schema.prisma` to `"sqlite"` and use `DATABASE_URL="file:./dev.db"`

### Production (Vercel)
- Uses PostgreSQL automatically
- See `DEPLOYMENT.md` for detailed setup instructions

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

### Available Scripts

```bash
npm run setup          # Create .env file with database configuration
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run db:push       # Push database schema changes
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Create and run migrations
npm run db:studio     # Open Prisma Studio (database GUI)
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
