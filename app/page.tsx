import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container text-center">
      <div className="card">
        <h1 className="title">
          Welcome to the Buyer Lead Intake App
        </h1>
        <p className="subtitle">
          Your streamlined solution for managing leads.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/buyers" className="btn btn-primary">
            View All Buyers
          </Link>
          <Link href="/buyers/new" className="btn btn-secondary">
            Create New Lead
          </Link>
          <Link href="/import" className="btn btn-secondary">
            Import CSV
          </Link>
          <Link href="/export" className="btn btn-secondary">
            Export CSV
          </Link>
        </div>
      </div>
    </main>
  );
}