import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { supabase } from "../../lib/supabaseClient";
import { ArrowLeft, MessageCircle, Heart } from "lucide-react";

function formatCondition(c) {
  return { new: "New", like_new: "Like New", good: "Good", fair: "Fair" }[c] || c;
}

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [messaging, setMessaging] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (!id) return;

    async function fetchListing() {
      setLoading(true);

      const { data, error } = await supabase
        .from("listings")
        .select(`*, listing_images (*)`)
        .eq("id", id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setListing(data);

      const sorted = (data.listing_images || []).sort((a, b) => a.display_order - b.display_order);
      setImages(sorted);

      // fetch seller profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.seller_id)
        .single();

      setSeller(profile);

      // increment views
      await supabase
        .from("listings")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);

      setLoading(false);
    }

    fetchListing();
  }, [id]);

  async function handleContactSeller() {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setMessaging(true);
    setMsgError("");

    try {
      // check if conversation already exists
      let { data: convo } = await supabase
        .from("conversations")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("buyer_id", currentUser.id)
        .single();

      // create if not
      if (!convo) {
        const { data: newConvo, error: convoErr } = await supabase
          .from("conversations")
          .insert({
            listing_id: listing.id,
            buyer_id: currentUser.id,
            seller_id: listing.seller_id,
          })
          .select()
          .single();

        if (convoErr) throw convoErr;
        convo = newConvo;
      }

      router.push(`/messages?id=${convo.id}`);
    } catch (err) {
      console.error("Conversation error:", err);
      setMsgError(`Error: ${err?.message || "Could not start conversation. Try again."}`);
    } finally {
      setMessaging(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <p className="text-sm text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Listing not found.</p>
        <Link href="/Listing/browse" className="text-sm underline text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Back to browse</Link>
      </div>
    );
  }

  const isOwner = currentUser?.id === listing.seller_id;

  return (
    <>
      <Head>
        <title>{listing.title} — Scentd</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-[#FAFAF9]">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Back */}
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <ArrowLeft size={16} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left — Images */}
            <div>
              {/* Main image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                {images.length > 0 ? (
                  <img src={images[activeImg]?.image_url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-300 text-6xl">🫧</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-gray-900" : "border-transparent"}`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Details */}
            <div className="flex flex-col">

              {/* Brand + title */}
              <div className="mb-4">
                {listing.brand && (
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{listing.brand}</p>
                )}
                <h1 className="text-3xl font-normal text-gray-900 leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {listing.title}
                </h1>
              </div>

              {/* Price */}
              <div className="text-3xl font-semibold text-gray-900 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ${listing.price}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {listing.condition && (
                  <span className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {formatCondition(listing.condition)}
                  </span>
                )}
                {listing.ml_size && (
                  <span className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {listing.ml_size}ml
                  </span>
                )}
                {listing.gender && (
                  <span className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {listing.gender.charAt(0).toUpperCase() + listing.gender.slice(1)}
                  </span>
                )}
                {listing.views > 0 && (
                  <span className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {listing.views} views
                  </span>
                )}
              </div>

              {/* Description */}
              {listing.description && (
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {listing.description}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-100 my-4" />

              {/* Seller */}
              {seller && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    {seller.avatar_url ? (
                      <img src={seller.avatar_url} alt={seller.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {seller.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{seller.full_name || "Seller"}</p>
                    {seller.city && <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>{seller.city}</p>}
                  </div>
                </div>
              )}

              {/* CTA */}
              {!isOwner && (
                <div className="flex flex-col gap-3 mt-auto">
                  {msgError && (
                    <p className="text-xs text-red-500" style={{ fontFamily: "'Poppins', sans-serif" }}>{msgError}</p>
                  )}
                  <button
                    onClick={handleContactSeller}
                    disabled={messaging}
                    className="w-full py-4 rounded-xl bg-[#1a1a18] text-white text-sm font-medium tracking-wide hover:bg-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    <MessageCircle size={16} />
                    {messaging ? "Opening chat..." : "Message Seller"}
                  </button>
                </div>
              )}

              {/* Owner actions */}
              {isOwner && (
                <div className="flex gap-3 mt-auto">
                  <Link href={`/listings/${listing.id}/edit`}
                    className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 text-center hover:border-gray-400 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Edit Listing
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.from("listings").update({ status: "sold" }).eq("id", listing.id);
                      router.push("/Listing/browse");
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Mark as Sold
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}