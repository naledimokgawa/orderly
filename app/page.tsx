import Link from 'next/link';
import { AppShell } from '../components/AppShell';

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-black tracking-tight text-[#4f46e5] md:text-7xl">
            Welcome to Ordarly
          </h1>

          <div className="mt-8 space-y-5 text-lg leading-8 text-slate-700">
            <p>
              Ordarly is a small business order manager designed to help you streamline your workflow,
              reduce errors, and keep everything organized in one place.
            </p>
            <p>
              With Ordarly, you can track deliveries, manage customer notes, and maintain accurate
              records without the usual chaos. Every feature is built to support clarity, accuracy,
              and privacy.
            </p>
            <p>
              We believe in accessibility, collaboration, and precision. That means Ordarly is
              responsive across devices, easy to use, and designed to reduce mistakes during order
              entry and fulfillment.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/login"
              className="rounded-xl bg-[#4f46e5] px-7 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4338ca]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
