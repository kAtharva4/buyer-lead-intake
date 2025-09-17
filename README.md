#### Mini “Buyer Lead Intake” App

This project is a full-stack web application for an internship assignment, built to capture, manage, and track buyer leads. It features a complete CRUD system with robust validation, search functionality, and CSV import/export. The application is designed to be deployed effortlessly on Vercel.

---

### Setup and Local Development

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/kAtharva4/buyer-lead-intake.git](https://github.com/kAtharva4/buyer-lead-intake.git)
    cd buyer-lead-intake
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Database setup**: The project uses **Supabase (PostgreSQL)**. Create a `.env` file and add your connection string and API keys.
    * `DATABASE_URL`: Your full connection URI from Supabase.
    * `NEXT_PUBLIC_SUPABASE_URL`: Your project's public URL.
    * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your public API key.

4.  **Run Prisma migrations**: This command will create your database tables and generate the Prisma client.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run locally**:
    ```bash
    pnpm dev
    ```
    The app will be available at `http://localhost:3000`.

---

### Design Notes

* **Validation**: Zod is used for validation on both the client and server, ensuring data integrity.
* **Rendering**: The main buyers list page (`/buyers`) is an **async Server Component** that handles data fetching and filtering on the server (SSR), providing optimal performance.
* **Ownership**: The API routes check the `ownerId` of each record against the current user's session to enforce that users can only edit or delete their own data.

---

### Deployment on Vercel

The project is fully configured for zero-configuration deployment on Vercel. After connecting your GitHub repository, Vercel will automatically build and deploy your application. **Remember to add your `DATABASE_URL` and other environment variables** in the Vercel project settings before the first deployment.

---

### What's Done vs. Skipped

* **Done**: All core requirements, including full CRUD, pagination, search/filters, CSV import/export, basic authentication, and a clean UI.
* **Skipped**: We did not implement an "admin role" or advanced unit tests, as the focus was on delivering a fully functional core application.

