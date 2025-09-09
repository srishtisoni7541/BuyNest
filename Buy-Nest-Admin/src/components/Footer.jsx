 // Footer Component
  const Footer = () => (
    <footer className="bg-white py-12 px-4 border-t">
      <div className="w-full px-20 mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">ShopHub</h3>
            <p className="text-slate-600">Your trusted partner for online shopping with quality products and exceptional service.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">Home</a>
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">Products</a>
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">About Us</a>
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
            <div className="space-y-2">
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">Help Center</a>
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">Returns</a>
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">Shipping Info</a>
              <a href="#" className="block text-slate-600 hover:text-slate-900 transition-colors">Size Guide</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Newsletter</h4>
            <p className="text-slate-600 mb-4">Stay updated with our latest offers</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button className="bg-slate-900 text-white px-6 py-2 rounded-r-lg hover:bg-slate-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-slate-600">
          <p>&copy; 2025 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  export default Footer;