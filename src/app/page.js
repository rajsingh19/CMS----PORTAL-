import { getProducts } from "../lib/api";

export const revalidate = 60; // optional ISR in production

export default async function Home() {
  let products = [];

  try {
    const data = await getProducts(); // uses the helper in src/lib/api.js
    // Support Strapi shapes: { data: [...] } or direct array
    products = Array.isArray(data) ? data : data?.data ?? [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
    products = [];
  }

  // Always use localhost for images
  const getImageUrl = (item) => {
    const base = "http://localhost:1337"; // hardcoded localhost
    const urlFromAttributes =
      item?.attributes?.image?.data?.[0]?.attributes?.url ||
      item?.attributes?.image?.url;
    const urlFromRoot = item?.image?.[0]?.url || item?.image?.url;
    const raw = urlFromAttributes || urlFromRoot;
    if (!raw) return "/placeholder.png";
    return raw.startsWith("http") ? raw : `${base}${raw}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center">
        Dummy Shopping Platform
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const product = p?.attributes ? { id: p.id, ...p.attributes } : p;
            const imageUrl = getImageUrl(p);

            return (
              <article
                key={p.id ?? product.id}
                className="group flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1"
              >
                <div className="w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={product.title ?? "Product image"}
                    loading="lazy"
                    className="w-full h-44 sm:h-56 md:h-48 lg:h-40 xl:h-44 object-cover transition-transform duration-300 transform group-hover:scale-105 max-h-[320px]"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.title || "No title"}
                  </h2>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-3 flex-1">
                    {product.description || "No description"}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price || "N/A"}
                    </span>

                    {product.buyLink && (
                      <a
                        href={product.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-block bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition text-center"
                      >
                        Buy Now
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
