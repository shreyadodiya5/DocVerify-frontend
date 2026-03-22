# DocVerify-frontend
# DocVerify — Frontend

React SPA for the DocVerify client-onboarding platform. Built with **React 18**, **Vite**, and **Tailwind CSS**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 + @tailwindcss/forms |
| Routing | React Router DOM 6 |
| Forms | React Hook Form + Yup validation |
| HTTP | Axios |
| Icons | Lucide React |
| Toasts | React Toastify |

---

## Project Structure

```
frontend/src/
├── components/
│   ├── Navbar.jsx             # Top navigation bar
│   ├── Sidebar.jsx            # Side navigation (dashboard layout)
│   ├── Footer.jsx             # Page footer
│   ├── ProtectedRoute.jsx     # Auth guard (redirects to /login)
│   ├── RequestCard.jsx        # Request summary card
│   ├── StatusBadge.jsx        # Colored status pill
│   ├── DocumentCard.jsx       # Document summary card
│   ├── DetailDocumentSlot.jsx # Document row with actions (verify/reject)
│   ├── UploadCard.jsx         # File upload dropzone card
│   ├── Modal.jsx              # Reusable modal component
│   └── Loader.jsx             # Spinner/loading indicator
├── context/
│   └── AuthContext.jsx        # Auth state (user, token, login/register/logout)
├── hooks/
│   └── useAuth.js             # useContext(AuthContext) shortcut
├── pages/
│   ├── Home.jsx               # Landing page
│   ├── About.jsx              # About page
│   ├── Contact.jsx            # Contact page
│   ├── FAQ.jsx                # FAQ page
│   ├── Login.jsx              # Login form (with resend verification)
│   ├── Signup.jsx             # Registration form (manager/client role select)
│   ├── VerifyEmail.jsx        # Email verification landing page
│   ├── Dashboard.jsx          # Request list with stats & filters
│   ├── Notifications.jsx     # Activity notifications
│   ├── RequestForm.jsx        # Create new request (manager only, 2-step)
│   ├── DocumentSelect.jsx     # Document type selector (step 2 of request)
│   ├── RequestDetail.jsx      # Full request view with document management
│   └── UploadPage.jsx         # Magic-link upload page (no auth needed)
├── services/
│   ├── api.js                 # Axios instance with JWT interceptors
│   ├── authService.js         # Auth API calls
│   ├── requestService.js      # Request CRUD API calls
│   ├── documentService.js     # Document upload/review API calls
│   └── userService.js         # Client search/lookup API calls
├── utils/
│   └── roles.js               # Role helper functions
├── App.jsx                    # Route definitions
├── main.jsx                   # React entry point
└── index.css                  # Global styles + Tailwind directives
```

---

## Pages & Routes

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with feature highlights |
| `/about` | About | About the platform |
| `/contact` | Contact | Contact information |
| `/faq` | FAQ | Frequently asked questions |
| `/login` | Login | Login form with email verification check |
| `/signup` | Signup | Registration with role selection |
| `/verify-email/:token` | VerifyEmail | Email verification landing page |
| `/upload/:token` | UploadPage | Magic-link document upload (no login) |

### Protected Routes (require login)

| Route | Page | Role | Description |
|-------|------|------|-------------|
| `/dashboard` | Dashboard | Any | Request list with stats, filters, search |
| `/notifications` | Notifications | Any | Activity feed |
| `/requests/new` | RequestForm | Manager | Create document request (2-step form) |
| `/requests/:id` | RequestDetail | Any | View request + manage documents |

---

## Environment Variables

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5001/api
```

> For network access (test on phone), use your local IP:  
> `VITE_API_URL=http://YOUR_IP:5001/api`

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
echo "VITE_API_URL=http://localhost:5001/api" > .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

The dev server runs on `http://localhost:5173` by default.

> The `--host` flag is already configured so the app is accessible on your local network.

---

## Key Features

- **Role-Based UI** — Managers see "Create Request" + review actions; Clients see upload + submit actions
- **Email Verification** — Users must verify email before logging in; resend option on login page
- **Magic-Link Uploads** — Clients can upload documents via secure links without logging in
- **Real-Time Filters** — Dashboard supports status filters + text search
- **Document Review** — Managers can approve/reject individual documents with remarks
- **Responsive Design** — Mobile-first layout with sidebar navigation
