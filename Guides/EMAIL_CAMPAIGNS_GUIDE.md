# 📧 Email Campaign System - Alumni Connect

Professional email notification system jo aapko sabhi users ko customized emails bhejna allow karta hai.

## ✨ Features

- **Professional HTML Templates** - Beautiful, responsive email templates
- **Customizable Content** - Event details, dates, venue, custom messages
- **Bulk Email Sending** - All Firebase users ko ek saath bhejo
- **User Filtering** - Role, batch, department ke basis par filter karo
- **Admin Control** - Full control over email content and recipients

## 📁 Templates Available

1. **Welcome Email** - New users ko welcome karne ke liye
2. **Event Announcement** - Events ke liye (date, time, venue customizable)
3. **Custom Announcement** - Koi bhi announcement bhejne ke liye

## 🚀 Usage Methods

### Method 1: Command Line (CLI)

Backend folder se run karo:

```bash
cd backend

# 1. Statistics dekhne ke liye
node scripts/send-email-campaign.js stats

# 2. Test email bhejne ke liye (apne email par)
node scripts/send-email-campaign.js test your-email@example.com

# 3. Welcome email bhejne ke liye (ALL users)
node scripts/send-email-campaign.js welcome

# 4. Event announcement bhejne ke liye
node scripts/send-email-campaign.js event

# 5. Custom announcement bhejne ke liye
node scripts/send-email-campaign.js custom
```

### Method 2: Admin API (Postman/Thunder Client)

#### 1. Get Email Statistics
```http
GET http://localhost:5000/api/email-campaigns/stats
Authorization: Bearer YOUR_ADMIN_TOKEN
```

#### 2. Send Welcome Email
```http
POST http://localhost:5000/api/email-campaigns/welcome
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "role": "alumni",       // Optional: filter by role
  "batch": "2020-2024",   // Optional: filter by batch
  "department": "CSE"     // Optional: filter by department
}
```

#### 3. Send Event Announcement
```http
POST http://localhost:5000/api/email-campaigns/event
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "eventTitle": "Alumni Meetup 2026",
  "eventDate": "January 15, 2026",
  "eventTime": "6:00 PM IST",
  "venue": "College Auditorium, ACEBIT Indri",
  "eventType": "Networking Event",
  "organizer": "Alumni Association",
  "registrationDeadline": "January 10, 2026",
  "description": "Join us for an exciting meetup where alumni share experiences...",
  "customMessage": "We're thrilled to invite you!",
  "eventUrl": "https://alumniconnect.acebits.in/events/123",
  "ctaText": "Register Now",

  // Optional filters
  "role": "alumni",
  "batch": "2020-2024"
}
```

#### 4. Send Custom Announcement
```http
POST http://localhost:5000/api/email-campaigns/custom
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "subject": "🚀 Platform Updates - Alumni Connect",
  "title": "Exciting New Features Released!",
  "badge": "🎉 NEW",
  "headerStyle": "success",
  "preMessage": "We have some exciting news!",
  "message": "We've just launched several new features:\n\n✨ Enhanced Directory\n💼 Better Job Matching\n📅 Event Management",
  "postMessage": "We hope you enjoy these features.",
  "ctaText": "Explore Now",
  "ctaUrl": "https://alumniconnect.acebits.in/dashboard",
  "additionalInfo": "Have feedback? Reply to this email!",

  // Optional filters
  "role": "student",
  "department": "ECE"
}
```

#### 5. Send Test Email
```http
POST http://localhost:5000/api/email-campaigns/test
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "recipientEmail": "your-email@example.com",
  "templateName": "event-announcement",
  "templateData": {
    "eventTitle": "Test Event",
    "eventDate": "Jan 15, 2026",
    "venue": "Test Venue"
  }
}
```

## 📝 Template Variables

### Welcome Email
- `firstName` - User's first name
- `platformUrl` - Alumni Connect URL

### Event Announcement
- `firstName` - User's first name
- `eventTitle` - Event name (required)
- `eventDate` - Event date (required)
- `eventTime` - Event time
- `venue` - Event location
- `eventType` - Type of event
- `organizer` - Organizer name
- `registrationDeadline` - Last date to register
- `description` - Event description
- `customMessage` - Custom message
- `eventUrl` - Event page URL
- `ctaText` - Button text

### Custom Announcement
- `firstName` - User's first name
- `subject` - Email subject
- `title` - Main heading
- `badge` - Badge text (e.g., "NEW", "URGENT")
- `headerStyle` - "info", "success", or "warning"
- `preMessage` - Text before main message
- `message` - Main message (required)
- `postMessage` - Text after main message
- `ctaText` - Button text
- `ctaUrl` - Button URL
- `additionalInfo` - Additional note

## 🎯 User Filtering

Aap emails ko filter kar sakte ho:

- **role**: `"student"`, `"alumni"`, or `"admin"`
- **batch**: e.g., `"2020-2024"`, `"2019-2023"`
- **department**: e.g., `"CSE"`, `"ECE"`, `"ME"`

Example:
```json
{
  "eventTitle": "CSE Alumni Meetup",
  "eventDate": "Jan 20, 2026",
  "role": "alumni",
  "department": "CSE"
}
```

## 📊 Email Statistics

Stats API se aapko pata chalega:
- Total verified users
- Students count
- Alumni count
- Available batches
- Available departments

## ⚙️ Configuration

`.env` file me ensure karo ye variables set hain:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://alumniconnect.acebits.in
```

## 🔒 Security

- Sare email campaign endpoints **Admin-only** hain
- Protect middleware authentication check karta hai
- isAdmin middleware admin role verify karta hai
- Only verified emails ko emails bheje jayenge

## 📧 Email Sending

- **Rate Limiting**: 10 emails per batch, 1 second delay between batches
- **Error Handling**: Failed emails track hote hain aur log hote hain
- **Success Tracking**: Kitne emails sent hue ye return hota hai

## 🧪 Testing

1. **Pehle test email bhejo** apne email par:
   ```bash
   node scripts/send-email-campaign.js test your-email@example.com
   ```

2. **Check karo email template** sahi dikh raha hai

3. **Phir bulk email bhejo** sabhi users ko

## 📌 Important Notes

- **Backup before sending**: Pehle database backup le lo
- **Test first**: Hamesha pehle test email bhejo
- **Check filters**: Ensure filters sahi hain
- **Monitor logs**: Server logs check karte raho
- **Gmail limits**: Gmail daily limit hai (500 emails/day for free accounts)

## 💡 Tips

1. **Custom events ke liye**: event-announcement template use karo
2. **General updates ke liye**: custom-announcement template use karo
3. **New users ke liye**: welcome template use karo
4. **Testing**: Pehle apne email par test karo
5. **Batch filtering**: Specific batches ko target karne ke liye filters use karo

## 🆘 Troubleshooting

**Email nahi ja raha?**
- Check `.env` file - EMAIL_USER aur EMAIL_PASSWORD sahi hai?
- Gmail me "App Password" use karo (not regular password)
- Check email logs for errors

**Template error?**
- Template file exist karta hai templates/emails folder me?
- Required fields (eventTitle, message) provide kiye?

**Authorization error?**
- Admin token use kar rahe ho?
- User ka role 'admin' hai database me?

## 🚀 Future Enhancements

- [ ] Schedule emails for later
- [ ] Email templates preview
- [ ] Click tracking
- [ ] Unsubscribe functionality
- [ ] Email history/logs
- [ ] Admin dashboard UI

---

**Need Help?** Contact the development team or check the main README.
