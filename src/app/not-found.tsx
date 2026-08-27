import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy px-4 pt-24 text-white">
      <div className="max-w-md text-center">
        <span className="eyebrow block mb-2">404 Error</span>
        <h1 className="text-6xl font-display font-light text-gold mb-4">404</h1>
        <h2 className="text-2xl font-light text-white mb-3">Page Not Found</h2>
        <p className="text-sm text-mist mb-8 font-light">
          The sanctuary you are searching for is not available or has moved to a new destination.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy font-semibold text-xs tracking-[0.2em] uppercase rounded-[2px] hover:bg-gold-light transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
