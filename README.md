# PlaySphere
Sports Club Management System. This website is made for sports club for management of payment and tracking payment and their promotion.
## Features
- Authentication (Google OAuth & Email/Password)
- Role-based access (Admin/User) 
- AI Fitness Chatbot
- CashFree Payment Integration
- Admin Dashboard
- User Management
- Program Enrollment
- Payment History Tracking

## Tech Stack
- Next.js
- TypeScript
- Prisma
- MongoDb
- NextAuth.js
- CashFree API
- ReplicateAI API
- Tailwind CSS

## Directory Structure

```bash
prisma/
 └── schema.prisma

src/
 ├── app/
 │   ├── api/
 │   │   ├── auth/
 │   │   │   ├── [...nextauth]/
 │   │   │   │   ├── auth.ts
 │   │   │   │   └── route.ts
 │   │   │   └── email/
 │   │   │       └── route.ts
 │   │   ├── chat/
 │   │   │   └── route.ts
 │   │   ├── contact/
 │   │   │   └── route.ts
 │   │   ├── get-payment/
 │   │   │   └── route.ts
 │   │   ├── models/
 │   │   │   └── prismaClient.ts
 │   │   ├── user/
 │   │   │   ├── profile/
 │   │   │   │   └── route.ts
 │   │   │   └── verify/
 │   │   │       └── route.ts
 │   │   └── verify-payment/
 │   │       └── route.ts
 │   │
 │   ├── authentication/
 │   │   ├── admin/
 │   │   │   └── page.tsx
 │   │   └── page.tsx
 │   │
 │   ├── contact/
 │   │   └── page.tsx
 │   │
 │   ├── payment/
 │   │   └── page.tsx
 │   │
 │   ├── payment-cancel/
 │   │   ├── paymentCancelPage.tsx
 │   │   └── page.tsx
 │   │
 │   ├── payment-success/
 │   │   ├── page.tsx
 │   │   └── PaymentSuccessPage.tsx
 │   │
 │   ├── profile/
 │   │   └── page.tsx
 │   │
 │   ├── sports/
 │   │   ├── [customSports]/
 │   │   └── page.tsx
 │   │
 │   ├── page.tsx
 │   └── layout.tsx
 │
 ├── assets/
 ├── components/
 │   └── ui/
 ├── data/
 │   └── sports_data.json
 └── utility/
     └── cn.ts

.env
```
## Installation
```bash
git clone https://github.com/raj-adi00/PlaySphere
cd PlaySphere
npm install
```
### Create .env
```bash
DATABASE_URL=mongodb url
ADMIN_PASS=Password to verify admin
GOOGLE_CLIENT_ID=Google client id for Oauth
GOOGLE_CLIENT_SECRET=Google client secret for OAuth
NEXTAUTH_SECRET=Next auth secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL= http://localhost:3000
REPLICATE_API_TOKEN=Chatbot key
CASHFREE_API_KEY=CashFree client id for transaction
CASHFREE_SECRET_KEY=Cashfree secret key for transaction
```
```bash
npx prisma generate
npx prisma db push
npm run dev
```
