import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-semibold text-foreground mb-2">404</h1>
      <p className="text-foreground/80 mb-6">This page could not be found.</p>
      <Link
        href="/"
        className="text-sm font-medium uppercase tracking-wider text-foreground underline hover:no-underline"
      >
        Back to home
      </Link>
    </div>
  );
}
