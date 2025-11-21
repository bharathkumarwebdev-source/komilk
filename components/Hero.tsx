import React from 'react';
import { ArrowRight, Droplet } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  return (
    <div className="relative bg-blue-900 overflow-hidden min-h-[600px] flex items-center rounded-3xl mx-4 mt-6 mb-12">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-700/50 rounded-full px-4 py-1.5 text-blue-200 text-sm backdrop-blur-sm">
            <Droplet size={14} className="fill-current" />
            <span>100% Organic & Grass-Fed</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Pure Freshness, <br />
            <span className="text-blue-400">Delivered Daily.</span>
          </h1>
          
          <p className="text-blue-100 text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
            Experience the difference of locally sourced, artisanal milk. From classic dairy to innovative plant-based blends, we bring the farm to your fridge.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <button 
              onClick={onShopNow}
              className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group"
            >
              Shop Our Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-blue-800/50 text-white border border-blue-700 rounded-xl font-semibold hover:bg-blue-800 transition-all backdrop-blur-sm">
              Our Story
            </button>
          </div>
        </div>

        <div className="relative hidden md:block h-full min-h-[400px]">
          {/* Decorative Image Composition */}
          <div className="relative w-full h-full flex justify-center items-center">
            <div className="relative z-10 w-80 h-96 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4 rotate-3 transform hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://picsum.photos/id/225/600/800" 
                alt="Pouring Milk" 
                className="w-full h-full object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Droplet size={24} className="fill-current" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Protein</p>
                  <p className="text-slate-900 font-bold">8g / serving</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;