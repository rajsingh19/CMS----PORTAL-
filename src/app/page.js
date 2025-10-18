import { getProducts } from "../lib/api";

export default async function Home() {
  let products = [];

  try {
    const res = await getProducts();
    products = res.data || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
        Dummy Shopping Platform
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-lg sm:text-xl">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden flex flex-col"
            >
              {product.image.length > 0 && (
                <img
                 src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${product.image[0].url}`}
                  alt={product.title}
                  className="w-full h-64 sm:h-56 md:h-48 lg:h-56 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="font-semibold text-lg sm:text-xl md:text-lg lg:text-xl mb-2">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base md:text-sm lg:text-base flex-grow">
                  {product.description}
                </p>
                <p className="font-bold mt-2 text-base sm:text-lg md:text-base lg:text-lg">
                  ₹{product.price}
                </p>
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
