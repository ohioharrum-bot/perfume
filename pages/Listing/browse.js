import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { Filter, X } from "lucide-react";
import Head from "next/head";

const CONDITIONS = ["new", "like_new", "good", "fair"];
const GENDERS = ["men", "women", "unisex"];

export default function Browse() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const [activeFilters, setActiveFilters] = useState({
    brands: [],
    conditions: [],
    genders: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  const q = typeof router.query.q === "string" ? router.query.q.trim() : "";

  // Fetch listings from Supabase
  useEffect(() => {
    async function fetchListings() {
      setLoadingListings(true);
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          listing_images (
            image_url,
            is_cover,
            display_order
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setListings(data);
      }
      setLoadingListings(false);
    }
    fetchListings();
  }, []);

  // Build filter options from fetched data
  const allBrands = useMemo(() => Array.from(new Set(listings.map((l) => l.brand).filter(Boolean))).sort(), [listings]);

  // Apply filters + search
  const results = useMemo(() => {
    let items = listings;

    if (q) {
      const term = q.toLowerCase();
      items = items.filter((l) =>
        l.title?.toLowerCase().includes(term) ||
        l.brand?.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term)
      );
    }

    if (activeFilters.brands.length > 0) {
      items = items.filter((l) => activeFilters.brands.includes(l.brand));
    }
    if (activeFilters.conditions.length > 0) {
      items = items.filter((l) => activeFilters.conditions.includes(l.condition));
    }
    if (activeFilters.genders.length > 0) {
      items = items.filter((l) => activeFilters.genders.includes(l.gender));
    }

    return items;
  }, [listings, activeFilters, q]);

  function toggleFilter(type, value) {
    setActiveFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  }

  function clearFilters() {
    setActiveFilters({ brands: [], conditions: [], genders: [] });
  }

  function getCoverImage(listing) {
    if (!listing.listing_images?.length) return null;
    const cover = listing.listing_images.find((i) => i.is_cover);
    return cover?.image_url || listing.listing_images[0]?.image_url;
  }

  function formatCondition(c) {
    return { new: "New", like_new: "Like New", good: "Good", fair: "Fair" }[c] || c;
  }

  const SidebarContent = (
    <div className="h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Filters</h2>

      {/* Brand */}
      {allBrands.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Brand</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {allBrands.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <input type="checkbox" className="accent-[var(--color-gold)]" checked={activeFilters.brands.includes(b)} onChange={() => toggleFilter("brands", b)} />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Condition */}
      <div className="mb-6">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Condition</h3>
        <div className="space-y-1">
          {CONDITIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <input type="checkbox" className="accent-[var(--color-gold)]" checked={activeFilters.conditions.includes(c)} onChange={() => toggleFilter("conditions", c)} />
              {formatCondition(c)}
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Gender</h3>
        <div className="space-y-1">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <input type="checkbox" className="accent-[var(--color-gold)]" checked={activeFilters.genders.includes(g)} onChange={() => toggleFilter("genders", g)} />
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <button onClick={clearFilters}
        className="w-full border border-[var(--color-gold)] text-[var(--color-gold)] rounded-lg py-1.5 text-sm hover:bg-[var(--color-gold)] hover:text-white transition-colors"
        style={{ fontFamily: "'Poppins', sans-serif" }}>
        Clear All
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:block sticky self-start top-24 h-max rounded-2xl border bg-white shadow-sm p-5">
          {SidebarContent}
        </aside>

        {/* Main */}
        <div>
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h1 className="text-2xl font-semibold tracking-wide" style={{ fontFamily: "'DM Serif Display', serif" }}>Browse</h1>
            <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm hover:bg-neutral-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Filter size={16} /> Filters
            </button>
          </div>

          {/* Active filter chips */}
          {(activeFilters.brands.length > 0 || activeFilters.conditions.length > 0 || activeFilters.genders.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {["brands", "conditions", "genders"].map((type) =>
                activeFilters[type].map((value) => (
                  <button key={`${type}-${value}`} onClick={() => toggleFilter(type, value)}
                    className="text-xs px-3 py-1 border border-[var(--color-gold)] rounded-full text-gray-700 bg-white hover:bg-[var(--color-gold)] hover:text-white transition"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {value} ✕
                  </button>
                ))
              )}
              <button onClick={clearFilters} className="text-xs px-3 py-1 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Clear All
              </button>
            </div>
          )}

          {/* Desktop header */}
          <div className="hidden lg:flex items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-semibold tracking-wide" style={{ fontFamily: "'DM Serif Display', serif" }}>Browse Fragrances</h1>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {loadingListings ? "Loading..." : `${results.length} listing${results.length !== 1 ? "s" : ""}${q ? ` for "${q}"` : ""}`}
              </p>
              <Link href="/Listing/createListing"
                className="px-4 py-2 bg-[#1a1a18] text-white text-sm rounded-xl hover:bg-black transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                + Sell yours
              </Link>
            </div>
          </div>

          {/* Loading state */}
          {loadingListings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border bg-white p-5 shadow-sm animate-pulse">
                  <div className="aspect-square rounded-xl bg-gray-100 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Listings grid */}
          {!loadingListings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((listing) => {
                const coverImage = getCoverImage(listing);
                return (
                  <div key={listing.id} onClick={() => router.push(`/Listing/${listing.id}`)} className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                    {/* Image */}
                    <div className="aspect-square mb-3 overflow-hidden rounded-xl bg-gray-50">
                      {coverImage ? (
                        <img src={coverImage} alt={listing.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-300 text-4xl">🫧</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold text-gray-900 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{listing.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>{listing.brand}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>${listing.price}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {listing.condition && (
                        <span className="text-xs px-2 py-1 rounded-full border bg-neutral-50 text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {formatCondition(listing.condition)}
                        </span>
                      )}
                      {listing.ml_size && (
                        <span className="text-xs px-2 py-1 rounded-full border bg-neutral-50 text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {listing.ml_size}ml
                        </span>
                      )}
                      {listing.gender && (
                        <span className="text-xs px-2 py-1 rounded-full border bg-neutral-50 text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {listing.gender.charAt(0).toUpperCase() + listing.gender.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loadingListings && results.length === 0 && (
            <div className="mt-20 text-center">
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {q ? `No listings found for "${q}"` : "No listings yet. Be the first to sell!"}
              </p>
              <Link href="/Listing/createListing"
                className="inline-block px-5 py-2.5 bg-[#1a1a18] text-white text-sm rounded-xl hover:bg-black transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}>
                + Create a listing
              </Link>
            </div>
          )}
        </div>

        {/* Mobile drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
            <div className="bg-white w-72 max-w-full h-full p-5 shadow-xl overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'DM Serif Display', serif" }}>Filters</h2>
                <button onClick={() => setShowFilters(false)}><X size={18} /></button>
              </div>
              {SidebarContent}
            </div>
            <div className="flex-1" onClick={() => setShowFilters(false)} />
          </div>
        )}
      </div>
    </>
  );
}