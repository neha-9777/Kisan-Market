function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🚜 KisanMarket </h3>
            <p className="text-gray-400">Connecting farmers directly with consumers for fresh, quality produce.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/products" className="hover:text-white transition">Products</a></li>
              <li><a href="/farmer" className="hover:text-white transition">For Farmers</a></li>
              <li><a href="/cart" className="hover:text-white transition">Cart</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@kisanmarket.com</li>
              <li>Phone: +91 98xx-xxxx-xx</li>
              <li>Address: xxxx-xxxx, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} KisanMarket. All rights reserved.</p>
          <p className="text-sm mt-2">Supporting sustainable agriculture and fair trade.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;