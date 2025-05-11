# Four Seasons Reservation Checker

This project provides two ways to monitor the availability of reservations at the Four Seasons restaurant for specific weekend slots (Friday, Saturday, Sunday at 16:30):

1. A Next.js web application for real-time monitoring
2. A GitHub Actions workflow for automated daily checks

## Features

### Web Application
- 🌐 Real-time availability checking
- 🔄 Server-Sent Events (SSE) for live updates
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern and clean user interface

### GitHub Actions Workflow
- 🔍 Daily automated checks for weekend reservations
- 📅 Monitors availability for the next 2 months
- 📧 Email notifications when slots become available
- 🎫 Direct booking links included in notifications
- 📝 GitHub Issues created for tracking available slots
- ⏰ Checks run daily at 9:00 AM UTC

## How It Works

### Web Application
The Next.js application provides a real-time interface to check availability:
1. Connects to the Four Seasons API
2. Uses Server-Sent Events for live updates
3. Displays available slots with booking links
4. Updates automatically when new slots become available

### GitHub Actions Workflow
The automated system uses GitHub Actions to:
1. Check availability for Friday, Saturday, and Sunday at 16:30
2. Parse the Four Seasons API response for available slots
3. Send email notifications with booking links when slots are found
4. Create GitHub Issues to track available dates

## Setup

### Web Application

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fourseasons-reserve.git
   cd fourseasons-reserve
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### GitHub Actions Workflow

1. Fork this Repository
   Click the "Fork" button in the top right of this repository to create your own copy.

2. Configure GitHub Secrets
   Add the following secrets to your repository (Settings > Secrets and variables > Actions):
   - `GMAIL_USERNAME`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: Your Gmail app password ([How to create an app password](https://support.google.com/accounts/answer/185833))
   - `NOTIFICATION_EMAIL`: The email address where you want to receive notifications

3. Enable GitHub Actions
   1. Go to the "Actions" tab in your repository
   2. Click "Enable Actions"
   3. The workflow will start running automatically at 9:00 AM UTC daily

## Customization

### Web Application
You can customize the web application by:
- Modifying the UI components in `app/components/`
- Adjusting the API endpoint in `app/api/check-availability/route.ts`
- Updating the SSE configuration in `app/page.tsx`

### GitHub Actions Workflow
You can customize the workflow by editing `.github/workflows/check-reservations.yml`:
- Change the schedule by modifying the `cron` expression
- Adjust the party size by modifying the `party_size` parameter in the API URL
- Modify the notification format in the email template

## Manual Trigger

You can manually trigger the GitHub Actions check at any time:
1. Go to the "Actions" tab
2. Select "Check Four Seasons Reservations"
3. Click "Run workflow"

## Development

### Tech Stack
- Next.js 14
- Tailwind CSS
- TypeScript
- Server-Sent Events (SSE)
- GitHub Actions

### Project Structure
```
fourseasons-reserve/
├── app/
│   ├── api/
│   │   └── check-availability/
│   │       └── route.ts
│   ├── components/
│   │   └── AvailabilityChecker.tsx
│   └── page.tsx
├── .github/
│   └── workflows/
│       └── check-reservations.yml
└── README.md
```

## Contributing

Feel free to submit issues and enhancement requests!
