import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { Filter, X, Search, ShoppingBag, Tag } from "lucide-react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const CONDITIONS = ["new", "like_new", "good", "fair"];
const GENDERS = ["men", "women", "unisex"];

function FragranceCard({ scent }) {
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  const imageUrl = imgError
    ? `https://source.unsplash.com/featured/400x400?perfume-bottle`
    : (scent.image || `https://source.unsplash.com/featured/400x400?${encodeURIComponent(scent.brand + ' ' + scent.name + ' perfume bottle')}`);

  return (
    <div
      onClick={() => router.push(`/fragrances/${scent.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={scent.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-gray-900 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{scent.name}</p>
        <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>{scent.brand}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>From ${scent.price}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>{scent.family}</span>
        </div>
      </div>
    </div>
  );
}

export default function Browse({ initialListings = [], initialFragrances = [] }) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [listings, setListings] = useState(initialListings);
  const [loadingListings, setLoadingListings] = useState(false);
  const [fragrances, setFragrances] = useState(initialFragrances);
  const [loadingFragrances, setLoadingFragrances] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ brands: [], conditions: [], genders: [] });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredFragrances = useMemo(() => {
    if (loadingFragrances) return [];
    let items = fragrances;
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      items = items.filter(
        (f) =>
          f.name.toLowerCase().includes(term) ||
          f.brand.toLowerCase().includes(term) ||
          f.family.toLowerCase().includes(term) ||
          (f.notes || []).some((n) => n.toLowerCase().includes(term))
      );
    }
    if (activeFilters.brands.length > 0) items = items.filter((f) => activeFilters.brands.includes(f.brand));
    if (activeFilters.genders.length > 0) items = items.filter((f) => activeFilters.genders.includes(f.gender));
    return items;
  }, [fragrances, loadingFragrances, debouncedSearch, activeFilters]);

  const filteredListings = useMemo(() => {
    let items = listings;
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      items = items.filter(
        (l) =>
          l.title?.toLowerCase().includes(term) ||
          l.brand?.toLowerCase().includes(term) ||
          l.description?.toLowerCase().includes(term)
      );
    }
    if (activeFilters.brands.length > 0) items = items.filter((l) => activeFilters.brands.includes(l.brand));
    if (activeFilters.conditions.length > 0) items = items.filter((l) => activeFilters.conditions.includes(l.condition));
    if (activeFilters.genders.length > 0) items = items.filter((l) => activeFilters.genders.includes(l.gender));
    return items;
  }, [listings, debouncedSearch, activeFilters]);

  const allBrands = useMemo(() => {
    const fromFragrances = fragrances.map((f) => f.brand);
    const fromListings = listings.map((l) => l.brand).filter(Boolean);
    return Array.from(new Set([...fromFragrances, ...fromListings])).sort();
  }, [fragrances, listings]);

  function toggleFilter(type, value) {
    setActiveFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [type]: updated };
    });
  }

  function clearFilters() {
    setActiveFilters({ brands: [], conditions: [], genders: [] });
  }

  function getCoverImage(listing) {
    if (!listing?.listing_images?.length) return null;
    const cover = listing.listing_images.find((i) => i.is_cover);
    return cover?.image_url || listing.listing_images[0]?.image_url;
  }

  function formatCondition(c) {
    return { new: "New", like_new: "Like New", good: "Good", fair: "Fair" }[c] || c;
  }

  const SidebarContent = (
    <div className="h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Filters</h2>
      <div className="mb-6">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Brand</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {allBrands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <input type="checkbox" className="accent-[var(--color-gold)]" checked={activeFilters.brands.includes(b)} onChange={() => toggleFilter("brands", b)} />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Condition (used only)</h3>
        <div className="space-y-1">
          {CONDITIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <input type="checkbox" className="accent-[var(--color-gold)]" checked={activeFilters.conditions.includes(c)} onChange={() => toggleFilter("conditions", c)} />
              {formatCondition(c)}
            </label>
          ))}
        </div>
      </div>
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
      <button onClick={clearFilters} className="w-full border border-[var(--color-gold)] text-[var(--color-gold)] rounded-lg py-1.5 text-sm hover:bg-[var(--color-gold)] hover:text-white transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
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

        <aside className="hidden lg:block sticky self-start top-24 h-max rounded-2xl border bg-white shadow-sm p-5">
          {SidebarContent}
        </aside>

        <div>

          <div className="hidden lg:flex items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl font-semibold tracking-wide" style={{ fontFamily: "'DM Serif Display', serif" }}>Browse Fragrances</h1>
            <Link href="/Listing/createListing" className="px-4 py-2 bg-[#1a1a18] text-white text-sm rounded-xl hover:bg-black transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
              + Sell yours
            </Link>
          </div>

          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h1 className="text-2xl font-semibold tracking-wide" style={{ fontFamily: "'DM Serif Display', serif" }}>Browse</h1>
            <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm hover:bg-neutral-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Filter size={16} /> Filters
            </button>
          </div>

          <div className="relative mb-6">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, brand, family, or notes..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 shadow-sm transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
            {[
              { key: "all", label: "All" },
              { key: "used", label: `Buy Used (${filteredListings.length})` },
              { key: "new", label: `Buy New (${filteredFragrances.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === tab.key ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500 hover:text-gray-700"}`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === "all" || activeTab === "used") && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={15} className="text-gray-500" />
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Buy Used on Scentd — save up to 60%
                </h3>
              </div>

              {loadingListings && (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border bg-white shadow-sm animate-pulse">
                      <div className="aspect-square rounded-t-2xl bg-gray-100" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingListings && filteredListings.length === 0 && (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-gray-400 text-sm mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>No used listings yet</p>
                  <Link href="/Listing/createListing" className="text-xs px-4 py-2 bg-[#1a1a18] text-white rounded-xl hover:bg-black transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    + Sell yours
                  </Link>
                </div>
              )}

              {!loadingListings && filteredListings.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredListings.map((listing) => {
                    const cover = getCoverImage(listing);
                    return (
                      <div key={listing.id} onClick={() => router.push(`/Listing/${listing.id}`)}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-50">
                          {cover ? (
                            <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-300 text-4xl">🫧</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-medium text-gray-900 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{listing.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>{listing.brand}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>${listing.price}</p>
                            {listing.condition && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {formatCondition(listing.condition)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {(activeTab === "all" || activeTab === "new") && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={15} className="text-gray-500" />
                <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Buy New — {filteredFragrances.length} fragrances
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFragrances.map((scent) => (
                  <FragranceCard key={scent.id} scent={scent} />
                ))}
              </div>
            </div>
          )}

        </div>

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

export async function getServerSideProps() {
  const supabaseUrl = "https://rvgfbbjclpaznfkfvcdl.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2ZiYmpjbHBhem5ma2Z2Y2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODUzMDksImV4cCI6MjA4OTE2MTMwOX0.NPUiVUqb_N5OCZpSIMpwKHU21rg-oDjjSxdPZSr421A";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: listings } = await supabase
    .from("listings")
    .select(`*, listing_images (image_url, is_cover, display_order)`)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const fragrances = (await import('../../data/fragrances')).default;

  let apiData = [];
  try {
    const res = await fetch('https://api.fragella.com/api/v1/usage', {
      headers: {
        'x-api-key': '18e6a531cc3601a30464ce80825887be2b5d16c79690553b4d0520ee7952b6f2'
      }
    });
    if (res.ok) {
      const raw = await res.json();
      apiData = Array.isArray(raw) ? raw : raw.data || raw.results || [];
    }
  } catch (e) {
    console.error(e);
  }

  const enriched = fragrances.map((item) => {
    const match = apiData.find((apiItem) => {
      const title = (apiItem.title || "").toLowerCase();
      return title.includes(item.name.toLowerCase());
    });
    return {
      ...item,
      image:
        match?.image_url ||
        match?.image ||
        match?.thumbnail ||
        match?.img ||
        item.image
    };
  });

  return {
    props: {
      initialListings: listings || [],
      initialFragrances: enriched
    }
  };
}