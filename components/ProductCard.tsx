import React from 'react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-blue-100">
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-slate-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-700">
          {product.category}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-sm">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 h-10 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {product.nutritionHighlights.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 mt-2 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">{product.volume} • {product.fatContent} Fat</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors active:scale-95"
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;