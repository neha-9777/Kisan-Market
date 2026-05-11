import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to KisanMarket
            {user && <span className="block text-2xl mt-2">Hi, {user.name}!</span>}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {user?.role === "farmer"
              ? "Manage your farm products and connect with customers"
              : user?.role === "vendor"
              ? "Discover fresh produce directly from local farmers"
              : "Buy fresh produce directly from farmers. Support local agriculture."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user?.role === "farmer" ? (
              <>
                <Link to="/farmer" className="inline-block bg-white text-green-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Go to Dashboard
                </Link>
                <Link to="/add-product" className="inline-block bg-green-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-600 transition-colors">
                  Add Product
                </Link>
              </>
            ) : user?.role === "vendor" ? (
              <Link to="/products" className="inline-block bg-white text-green-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Browse Products
              </Link>
            ) : (
              <>
                <Link to="/products" className="inline-block bg-white text-green-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  Explore Products
                </Link>
                <Link to="/register" className="inline-block bg-green-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-600 transition-colors">
                  Join KisanMarket
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.4em] text-green-700 font-semibold mb-3">Browse by category</p>
          <h2 className="text-3xl font-bold">Find what you need fast</h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Explore fresh produce, farming essentials, and specialty goods through beautifully organized category cards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { title: "Fruits", icon: "🍎" },
            { title: "Vegetables", icon: "🥦" },
            { title: "Seeds", icon: "🌾" },
            { title: "Rice", icon: "🍚" },
            { title: "Wheat", icon: "🌾" },
            { title: "Pulses", icon: "🥣" },
            { title: "Spices", icon: "🧂" },
            { title: "Dairy Products", icon: "🧀" },
            { title: "Organic Products", icon: "🌿" },
            { title: "Farming Tools", icon: "🛠️" },
            { title: "Fertilizers", icon: "🧪" },
            { title: "Flowers", icon: "🌸" }
          ].map((category) => (
            <div key={category.title} className="bg-white p-6 rounded-3xl shadow-md border border-green-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-green-50 text-3xl mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600">Fresh selections, quality options, and farm-to-table goodness in every category.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          {user?.role === "farmer" ? "Why Farmers Choose KisanMarket" : "Why Choose KisanMarket?"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {user?.role === "farmer" ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">Fair Prices</h3>
                <p className="text-gray-600">Get the best prices for your produce without middlemen</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">�</div>
                <h3 className="text-xl font-bold mb-2">Track Sales</h3>
                <p className="text-gray-600">Monitor your product performance and revenue in real-time</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-2">Direct Connection</h3>
                <p className="text-gray-600">Connect directly with consumers who value fresh, local produce</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-2">Fresh Produce</h3>
                <p className="text-gray-600">Get freshly picked fruits and vegetables directly from farms</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">👨‍🌾</div>
                <h3 className="text-xl font-bold mb-2">Support Farmers</h3>
                <p className="text-gray-600">Support local farmers with fair prices without middlemen</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Role-specific CTA */}
      {!user && (
        <div className="bg-gray-100 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="text-5xl mb-4">🌾</div>
                <h3 className="text-2xl font-bold mb-4">Are you a Farmer?</h3>
                <p className="text-gray-600 mb-6">Sell your fresh produce directly to consumers and earn more.</p>
                <Link to="/register" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Register as Farmer
                </Link>
              </div>
              <div className="bg-white p-8 rounded-lg shadow">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold mb-4">Are you a Vendor?</h3>
                <p className="text-gray-600 mb-6">Buy fresh produce directly from farmers at great prices.</p>
                <Link to="/register" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Register as Vendor
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;