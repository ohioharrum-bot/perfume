import { useRouter } from "next/router";
import Link from "next/link";
import fragrances from "@/data/fragrances";
import formatPrice from "@/lib/formatPrice";
import { CheckCircle } from "lucide-react";

export default function FragranceDetail() {
  const router = useRouter();
  const { id } = router.query;

  const fragrance = fragrances.find((f) => f.id === id);

  if (!fragrance) {
    return (
      <div className="mx-auto max-w-4xl px-6 sm:px-8 py-20 text-center">
        <p className="text-gray-500 animate-ss-up">Fragrance not found.</p>
        <Link
          href="/browse"
          className="mt-6 inline-block text-sm text-[var(--color-gold)] hover:underline"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const lowest =
    fragrance.listings?.length > 0
      ? Math.min(...fragrance.listings.map((l) => l.price))
      : fragrance.price;

  const similar = fragrances
    .filter(
      (f) =>
        f.id !== fragrance.id &&
        (f.family === fragrance.family ||
          f.notes.some((n) => fragrance.notes.includes(n)))
    )
    .slice(0, 3);

  const trustedRetailers = [
    {
      name: "FragranceNet",
      url: "https://www.fragrancenet.com",
      logo: "/trusted/fragrancenet.png",
    },
    {
      name: "FragranceX",
      url: "https://www.fragrancex.com",
      logo: "/trusted/fragrancex.png",
    },
    {
      name: "Sephora",
      url: "https://www.sephora.com",
      logo: "/trusted/sephora.png",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 animate-ss-fade-slow">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/browse"
          className="text-sm text-gray-500 hover:text-[var(--color-gold)] transition-colors"
        >
          ← Back to Browse
        </Link>
      </div>

      {/* ===== Main Info Section ===== */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Image */}
        <div className="flex-1 max-w-md mx-auto lg:mx-0">
          <div className="aspect-square overflow-hidden rounded-2xl border shadow-sm bg-white">
            <img
              src={fragrance.image || "/placeholder.png"}
              alt={fragrance.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1">
          <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
            {fragrance.name}
          </h1>
          <h2 className="text-base sm:text-lg text-gray-600 mb-6">
            {fragrance.brand}
          </h2>

          <div className="border-t border-b border-gray-200 py-4 mb-6 text-sm sm:text-base">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-gray-700">
                <span className="font-medium">Family:</span>{" "}
                {fragrance.family}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">MSRP:</span>{" "}
                {formatPrice(fragrance.price)}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <span className="font-medium text-gray-800 text-sm sm:text-base">
              Notes:
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {fragrance.notes.map((n) => (
                <span
                  key={n}
                  className="text-xs sm:text-sm px-3 py-1 rounded-full border bg-neutral-50"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
            From {formatPrice(lowest)}
          </div>
        </div>
      </div>

      {/* ===== SureScent Listings ===== */}
      <div className="my-14 border-t border-gray-200 relative">
        <div className="absolute inset-0 flex justify-center">
          <span className="bg-white px-4 -translate-y-3 text-[var(--color-gold)] text-xs uppercase tracking-wide font-semibold">
            SureScent Listings
          </span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {fragrance.listings.length > 0 ? (
          fragrance.listings.map((listing, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  {formatPrice(listing.price)}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <CheckCircle className="w-4 h-4 text-[var(--color-gold)]" />
                  <span>Verified Seller</span>
                </div>
                <div className="mt-auto pt-4">
                  <button className="w-full py-2 rounded-lg border border-black text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-colors">
                    View Offer
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">
            No active user listings yet for this fragrance.
          </p>
        )}
      </div>

      {/* ===== Trusted Retailers ===== */}
      <div className="mt-20 border-t border-gray-200 relative">
        <div className="absolute inset-0 flex justify-center">
          <span className="bg-white px-4 -translate-y-3 text-[var(--color-gold)] text-xs uppercase tracking-wide font-semibold">
            Trusted Retailers
          </span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {trustedRetailers.map((r) => (
          <a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-20 h-20 mb-3">
              <img
                src={r.logo}
                alt={r.name}
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-[var(--color-gold)] transition-all" />
            </div>
            <div className="font-medium text-gray-900">{r.name}</div>
            <span className="text-sm text-[var(--color-gold)] mt-1">
              Visit Site →
            </span>
          </a>
        ))}
      </div>

      {/* ===== Description Section ===== */}
      <div className="mt-20 max-w-3xl mx-auto text-center px-2">
        <h3 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-semibold mb-4">
          About {fragrance.name}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          {fragrance.description ||
            "A timeless composition blending exquisite notes to evoke confidence and sophistication. Each bottle tells a story — crafted for those who appreciate refinement and individuality."}
        </p>
      </div>

      {/* ===== You May Also Like ===== */}
      {similar.length > 0 && (
        <div className="mt-20">
          <h3 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-semibold text-center mb-10">
            You May Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((f) => {
              const lowest =
                f.listings?.length > 0
                  ? Math.min(...f.listings.map((l) => l.price))
                  : f.price;

              return (
                <div
                  key={f.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square mb-3 overflow-hidden rounded-xl">
                    <img
                      src={f.image}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-lg font-semibold">{f.name}</div>
                  <div className="text-sm text-gray-500">{f.brand}</div>
                  <div className="text-sm font-medium mt-2">
                    From {formatPrice(lowest)}
                  </div>
                  <Link
                    href={`/fragrances/${f.id}`}
                    className="mt-3 inline-block text-sm hover:text-[var(--color-gold)] transition-colors"
                  >
                    View details →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
