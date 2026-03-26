import { useState } from "react";
import fragrances from "@/data/fragrances";
import Link from "next/link";
import formatPrice from "@/lib/formatPrice";

export default function ScentFinder() {
  const [answers, setAnswers] = useState({
    family: "",
    mood: "",
    price: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic matching logic based on family & price range
    const { family, price } = answers;
    let filtered = fragrances;

    if (family) {
      filtered = filtered.filter(
        (f) => f.family.toLowerCase() === family.toLowerCase()
      );
    }

    if (price) {
      const maxPrice = parseInt(price);
      filtered = filtered.filter((f) => f.price <= maxPrice);
    }

    const suggestion = filtered[Math.floor(Math.random() * filtered.length)];
    setResult(suggestion || null);
  };

  return (
    <div className="bg-gradient-to-b from-[#fffaf5] to-white min-h-screen font-[var(--font-lora)]">
      {/* ===== Header Section ===== */}
      <section className="mx-auto max-w-5xl px-6 sm:px-8 py-20 text-center">
        <h1 className="font-[var(--font-cormorant)] text-5xl sm:text-6xl font-semibold text-gray-900 mb-6">
          Scent Finder
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Not sure where to start? Take this quick scent quiz and we’ll recommend
          a fragrance that suits your personality and preferences.
        </p>
      </section>

      {/* ===== Quiz Section ===== */}
      <section className="mx-auto max-w-3xl px-6 sm:px-8 py-16 border-t border-neutral-200">
        {!result ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm shadow-md border rounded-3xl p-8 sm:p-10 space-y-8"
          >
            {/* Family Selection */}
            <div>
              <label
                htmlFor="family"
                className="block text-sm font-semibold mb-2 font-[var(--font-cormorant)] text-gray-800"
              >
                What type of fragrance family do you prefer?
              </label>
              <select
                id="family"
                name="family"
                value={answers.family}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-black/20 focus:outline-none font-[var(--font-lora)]"
              >
                <option value="">Select one...</option>
                <option value="Woody">Woody</option>
                <option value="Floral">Floral</option>
                <option value="Amber">Amber</option>
                <option value="Citrus">Citrus</option>
                <option value="Green">Green</option>
                <option value="Aquatic">Aquatic</option>
              </select>
            </div>

            {/* Mood Selection */}
            <div>
              <label
                htmlFor="mood"
                className="block text-sm font-semibold mb-2 font-[var(--font-cormorant)] text-gray-800"
              >
                What’s your mood or vibe today?
              </label>
              <select
                id="mood"
                name="mood"
                value={answers.mood}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-black/20 focus:outline-none font-[var(--font-lora)]"
              >
                <option value="">Select one...</option>
                <option value="fresh">Fresh & Energetic</option>
                <option value="warm">Warm & Cozy</option>
                <option value="romantic">Romantic & Floral</option>
                <option value="bold">Bold & Confident</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold mb-2 font-[var(--font-cormorant)] text-gray-800"
              >
                What’s your ideal price range?
              </label>
              <select
                id="price"
                name="price"
                value={answers.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-black/20 focus:outline-none font-[var(--font-lora)]"
              >
                <option value="">Select one...</option>
                <option value="80">Under $80</option>
                <option value="120">Under $120</option>
                <option value="160">Under $160</option>
                <option value="200">Under $200</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl border border-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all"
            >
              Find My Scent
            </button>
          </form>
        ) : (
          <div className="text-center bg-white/90 border rounded-3xl shadow-md p-10 animate-ss-fade">
            <h2 className="font-[var(--font-cormorant)] text-3xl font-semibold mb-6 text-gray-900">
              Your Recommended Scent
            </h2>

            {result ? (
              <div className="max-w-md mx-auto">
                <img
                  src={result.image || "/placeholder.jpg"}
                  alt={result.name}
                  className="w-full rounded-2xl border shadow-sm mb-6"
                />
                <h3 className="font-[var(--font-cormorant)] text-2xl font-semibold text-gray-900 mb-1">
                  {result.name}
                </h3>
                <p className="text-gray-600 font-[var(--font-lora)] mb-2">
                  {result.brand}
                </p>
                <p className="text-gray-700 font-[var(--font-lora)] mb-4">
                  {result.family} Family • {formatPrice(result.price)}
                </p>

                <Link
                  href={`/fragrance/${result.id}`}
                  className="inline-block rounded-xl border border-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all"
                >
                  View Details
                </Link>
              </div>
            ) : (
              <p className="text-gray-600 font-[var(--font-lora)]">
                No matching fragrances found. Try adjusting your preferences.
              </p>
            )}

            <button
              onClick={() => {
                setResult(null);
                setAnswers({ family: "", mood: "", price: "" });
              }}
              className="mt-8 inline-block rounded-xl border border-gray-400 px-8 py-2 text-sm font-medium hover:bg-gray-100 transition-all"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </section>

      {/* ===== Back Button ===== */}
      <section className="mx-auto max-w-4xl px-6 sm:px-8 py-16 text-center border-t border-neutral-200">
        <Link
          href="/browse"
          className="inline-block rounded-xl border border-black px-8 py-3 text-sm font-medium hover:bg-black hover:text-white transition-all"
        >
          ← Back to Browse
        </Link>
      </section>
    </div>
  );
}
