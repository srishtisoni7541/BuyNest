import {
  Star,
  Truck,
  Shield,
  Headphones,
  ArrowRight,
} from "lucide-react";

import HeroSection from "../components/HeroSection";

import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  // Reusable Card Component
  const Card = ({ children, className = "", hover = true }) => {
    return (
      <div
        className={`bg-white rounded-xl p-6 shadow-lg ${
          hover ? "hover:shadow-2xl hover:-translate-y-1" : ""
        } transition-all duration-300 ${className}`}
      >
        {children}
      </div>
    );
  };

  // Features Section Component
  const FeaturesSection = () => {
    const features = [
      {
        icon: <Truck className="w-8 h-8" />,
        title: "Fast Delivery",
        description:
          "Free shipping on orders over $50. Get your products delivered within 2-3 business days.",
      },
      {
        icon: <Shield className="w-8 h-8" />,
        title: "Secure Shopping",
        description:
          "Your data is protected with industry-standard encryption and secure payment processing.",
      },
      {
        icon: <Headphones className="w-8 h-8" />,
        title: "24/7 Support",
        description:
          "Our customer service team is always ready to help you with any questions or concerns.",
      },
    ];

    return (
      <section className="py-20 px-4 bg-white">
        <div className="w-full px-20 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-slate-600">
              Experience the difference with our premium service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-900">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const ProductsSection = () => {
    const products = [
      {
        name: "Wireless Headphones",
        price: "$129.99",
        rating: 5,
        img: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d2lyZWxlc3MlMjBoZWFkcGhvbmVzfGVufDB8fDB8fHww",
      },
      {
        name: "Smart Watch",
        price: "$299.99",
        rating: 4,
        img: "https://images.unsplash.com/photo-1617043593449-c881f876a4b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNtYXJ0JTIwd2F0Y2hlc3xlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        name: "Phone Case",
        price: "$24.99",
        rating: 5,
        img: "https://images.unsplash.com/photo-1617043593449-c881f876a4b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNtYXJ0JTIwd2F0Y2hlc3xlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        name: "Laptop Stand",
        price: "$89.99",
        rating: 4,
        img: "https://images.unsplash.com/photo-1629317480826-910f729d1709?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bGFwdG9wJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D",
      },
    ];

    return (
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full px-20 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-slate-600">
              Discover our most popular items
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Card key={index}>
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-slate-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-slate-900">
                    {product.price}
                  </span>
                  <div className="flex items-center">
                    {[...Array(product.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <Button className="w-full">Add to Cart</Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="secondary" className="text-lg px-8 py-4">
              View All Products
            </Button>
          </div>
        </div>
      </section>
    );
  };

  // CTA Section Component
  const CTASection = () => (
    <section className="py-20 px-4 bg-slate-900">
      <div className="w-full px-20 mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Start Shopping?
        </h2>
        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
          Join thousands of satisfied customers and discover amazing products at
          unbeatable prices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="border-white text-slate-900  text-lg px-8 py-4">
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            className="border-white text-white  text-lg px-8 py-4"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
