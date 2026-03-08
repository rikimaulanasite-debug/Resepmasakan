'use client';

import { useState } from 'react';
import { Search, ChefHat, Loader2, UtensilsCrossed, ArrowRight, Clock, Users, X, Flame, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

interface Recipe {
  judul: string;
  thumb: string;
  waktu_masak: string;
  hasil: string;
  tingkat_kesulitan: string;
  bahan: string;
  langkah_langkah: string;
}

interface ApiResponse {
  status: boolean;
  data: Recipe[];
}

function RecipeCard({ recipe, index, onSelect }: { recipe: Recipe; index: number; onSelect: (r: Recipe) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md border border-stone-100 h-full"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {recipe.thumb ? (
          <Image
            src={recipe.thumb}
            alt={recipe.judul}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-300">
            <ChefHat size={48} />
          </div>
        )}
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-stone-600 backdrop-blur-sm shadow-sm">
          {recipe.tingkat_kesulitan}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-stone-800 group-hover:text-orange-600 transition-colors">
          {recipe.judul}
        </h3>

        <div className="mt-auto flex items-center justify-between text-xs font-medium text-stone-500">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-orange-500" />
            <span>{recipe.waktu_masak}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-orange-500" />
            <span>{recipe.hasil}</span>
          </div>
        </div>
        
        <button 
          onClick={() => onSelect(recipe)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-stone-100 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
        >
          View Recipe <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function RecipeModal({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  // Helper to split text by newlines, filter empty strings, and deduplicate
  const parseList = (text: string) => {
    if (!text) return [];
    const items = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    return Array.from(new Set(items));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative h-64 w-full shrink-0 sm:h-80">
          <Image
            src={recipe.thumb}
            alt={recipe.judul}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/40"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-0 left-0 p-6 sm:p-8">
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                {recipe.tingkat_kesulitan}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                {recipe.waktu_masak}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                {recipe.hasil}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-4xl">{recipe.judul}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-2 text-orange-600">
                <Flame size={24} />
                <h3 className="text-xl font-bold text-stone-900">Ingredients</h3>
              </div>
              <ul className="space-y-2 text-stone-600">
                {parseList(recipe.bahan).map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2 text-orange-600">
                <BookOpen size={24} />
                <h3 className="text-xl font-bold text-stone-900">Instructions</h3>
              </div>
              <ol className="space-y-4 text-stone-600">
                {parseList(recipe.langkah_langkah).map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                      {i + 1}
                    </span>
                    <p className="flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);
    setRecipes([]);
    setSelectedRecipe(null);
    setCurrentPage(1);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data: ApiResponse = await res.json();
      
      if (data.status && Array.isArray(data.data)) {
        setRecipes(data.data);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white pb-12 pt-16 shadow-sm lg:pt-24">
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute -left-4 top-20 h-64 w-64 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-yellow-500 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex justify-center"
            >
              <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                <ChefHat size={40} />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl"
            >
              Resep<span className="text-orange-600">Ku</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-4 max-w-2xl text-lg text-stone-600"
            >
              Discover delicious Indonesian recipes and more. Just type what you&apos;re craving.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mt-8 max-w-xl"
            >
              <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recipes (e.g., Nasi Goreng)..."
                  className="w-full rounded-2xl border-0 bg-white py-4 pl-6 pr-14 text-lg shadow-lg ring-1 ring-stone-200 transition-shadow focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 rounded-xl bg-orange-600 p-2.5 text-white transition-colors hover:bg-orange-700 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Search />}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-orange-500" />
            <p className="mt-4 text-stone-500">Finding the best recipes for you...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-8 text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentRecipes.map((recipe, index) => (
                <RecipeCard 
                  key={index} 
                  recipe={recipe} 
                  index={index} 
                  onSelect={setSelectedRecipe}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === number
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : searched ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <UtensilsCrossed size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-stone-500">No recipes found.</p>
            <p>Try searching for something else like &quot;Sate Ayam&quot; or &quot;Rendang&quot;.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
             <div className="grid grid-cols-2 gap-4 opacity-30 md:grid-cols-4 mb-8">
               {['Nasi Goreng', 'Rendang', 'Sate', 'Soto'].map((item) => (
                 <div key={item} className="rounded-lg border border-stone-300 p-4 text-center">
                   {item}
                 </div>
               ))}
            </div>
            <p className="text-stone-500">Start by searching for a recipe above.</p>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-center text-sm text-stone-500">
        <p>Copyright @iky.apake</p>
      </footer>
    </main>
  );
}
