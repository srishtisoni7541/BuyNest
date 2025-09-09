import  Button from './Button';
import {ArrowRight,Check, Star} from 'lucide-react'
  const HeroSection = () => (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-4">
      <div className="w-full px-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Discover Amazing Products
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Shop the latest trends with unbeatable prices and fast delivery. Your perfect shopping experience starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="text-lg px-8 py-4">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" className="text-lg px-8 py-4">
                Browse Collections
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Free Shipping
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2" />
                30-Day Returns
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2" />
                24/7 Support
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-slate-900 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg">
                    <img className="h-full w-full object-cover" src="https://plus.unsplash.com/premium_photo-1683288295814-84a199da83d9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                </div>
                <h3 className="font-semibold text-slate-900">Premium Product</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900">$99.99</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  export default HeroSection;