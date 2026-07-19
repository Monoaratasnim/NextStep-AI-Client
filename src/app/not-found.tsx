import Link from "next/link";
import { MapPin } from "lucide-react";
import Button from "@/components/shared/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-md">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#111111] border border-[#27272A] shadow-lg shadow-black/20">
          <span className="text-5xl font-bold tracking-tight text-[#4F46E5]">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="primary" size="lg" className="gap-2">
              <MapPin className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/careers">
            <Button variant="outline" size="lg">
              Explore Career Library
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
