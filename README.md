#### Mini “Buyer Lead Intake” Application

This project is a full-stack web application designed to capture, manage, and track buyer leads. It was developed as an internship assignment to demonstrate proficiency in modern web development practices, including robust validation, server-side rendering, and secure data handling.

---

### Key Features

* **Comprehensive CRUD**: Complete Create, Read, Update, and Delete functionality for buyer leads.
* **Server-Side Rendering (SSR)**: The main leads dashboard (`/buyers`) is an `async` Server Component, ensuring fast load times and dynamic data fetching.
* **Advanced Validation**: A centralized Zod schema is used for both client-side and server-side validation, ensuring data integrity.
* **Import/Export**: Supports bulk data operations via CSV, including a transactional import with row-level error reporting and an export function that respects applied filters.
* **Access Control**: Implements ownership-based access control, allowing users to edit and delete only their own records.
* **Vercel Deployment**: The application is configured for seamless, zero-downtime deployment on the Vercel platform.

---

### Technology Stack

* **Framework**: Next.js (App Router) + TypeScript
* **Database**: Supabase (PostgreSQL)
* **ORM**: Prisma with migrations
* **Validation**: Zod
* **Styling**: Custom CSS
* **Version Control**: Git

---

### Getting Started

To run this project locally, follow these steps.

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/kAtharva4/buyer-lead-intake.git](https://github.com/kAtharva4/buyer-lead-intake.git)
    cd buyer-lead-intake
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Database Configuration**:
    * This project uses a PostgreSQL database, ideally hosted on **Supabase**.
    * Create a `.env` file in the project root and add your database connection URI and API keys.
    * **`.env.example`**:
        ```
        DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"
        NEXT_PUBLIC_SUPABASE_URL="[https://your-supabase-url.supabase.co](https://your-supabase-url.supabase.co)"
        NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
        ```

4.  **Run Migrations**: This command will set up the necessary tables in your database.
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start the Development Server**:
    ```bash
    pnpm dev
    ```
    The application will be accessible at `http://localhost:3000`.

---

### Project Status and Notes

* **Completed Requirements**: All core functionalities specified in the assignment have been successfully implemented.
* **Design Decisions**:
    * **Validation**: Validation logic is centralized in `src/lib/validation.ts` to be reusable and consistent across the frontend and backend.
    * **Data Flow**: The Server Component model (`/buyers`) was chosen to offload data-intensive operations to the server, improving client-side performance.
    * **Access Control**: Ownership checks are hard-coded in the API routes for demo purposes, demonstrating the fundamental security principle of data ownership.
* **Future Enhancements**: Optional features such as an admin role, unit tests, and optimistic UI updates were skipped to meet the core assignment deadline but could be implemented as a next step.
