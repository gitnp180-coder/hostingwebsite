
import React, { useState, useEffect } from 'react';
import { Reflection, VIBES, Postcard } from './types';
import ReflectionCard from './components/ReflectionCard';
import PostcardDisplay from './components/PostcardDisplay';
import { generatePostcard } from './services/geminiService';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [activeVibe, setActiveVibe] = useState(VIBES[0]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [selectedPostcard, setSelectedPostcard] = useState<Postcard | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mina_reflections');
    if (saved) {
      try {
        setReflections(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newReflection: Reflection = {
      id: Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      vibe: activeVibe.name,
      gradient: activeVibe.color,
      timestamp: Date.now(),
    };

    const updated = [newReflection, ...reflections];
    setReflections(updated);
    localStorage.setItem('mina_reflections', JSON.stringify(updated));
    setText('');
  };

  const deleteReflection = (id: string) => {
    const updated = reflections.filter(r => r.id !== id);
    setReflections(updated);
    localStorage.setItem('mina_reflections', JSON.stringify(updated));
  };

  const handleGeneratePostcard = async (reflection: Reflection) => {
    setIsGenerating(true);
    setSelectedPostcard(null);
    try {
      const postcard = await generatePostcard(reflection);
      setSelectedPostcard(postcard);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Generation failed:", error);
      alert("The manifestation engine encountered a quiet moment. Please try again soon.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 pb-24 selection:bg-indigo-100">
      {/* Decorative Header */}
      <nav className="pt-16 pb-12 px-8 text-center">
        <h1 className="text-5xl font-serif italic tracking-tight text-slate-800">Mina</h1>
        <div className="h-px w-12 bg-slate-200 mx-auto mt-4"></div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">
        {/* Postcard View */}
        {isGenerating && (
          <div className="mb-20 text-center py-12 animate-pulse">
            <p className="text-xl font-serif italic text-slate-400">Capturing the essence of your thought...</p>
          </div>
        )}

        {selectedPostcard && !isGenerating && (
          <div className="mb-24 animate-in fade-in zoom-in duration-700">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400">Manifestation Result</h2>
                <button 
                  onClick={() => setSelectedPostcard(null)}
                  className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 hover:text-slate-800 transition-colors"
                >
                  Close Postcard
                </button>
             </div>
             <PostcardDisplay postcard={selectedPostcard} />
          </div>
        )}

        {/* Entry Section */}
        {!selectedPostcard && (
          <section className="mb-20">
            <form onSubmit={handleSave} className="max-w-xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-xs uppercase tracking-[0.3em] font-semibold text-slate-400">What is on your mind?</h2>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write an intention or a quiet thought..."
                  className="w-full bg-transparent border-b border-slate-200 focus:border-slate-800 outline-none py-4 text-2xl font-serif italic text-center transition-colors placeholder:text-slate-200 resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 text-center">Choose your Aura</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {VIBES.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setActiveVibe(v)}
                      className={`w-8 h-8 rounded-full transition-all duration-300 ring-offset-4 ${activeVibe.name === v.name ? 'ring-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                      style={{ background: v.color }}
                      title={v.name}
                    />
                  ))}
                </div>
                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest h-4">
                  {activeVibe.name}
                </p>
              </div>

              <div className="flex justify-center pt-4">
                <button 
                  type="submit"
                  disabled={!text.trim()}
                  className={`px-10 py-3 rounded-full font-serif text-lg tracking-wide transition-all border ${
                    text.trim() 
                    ? 'border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white active:scale-95 shadow-sm' 
                    : 'border-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Save Reflection
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Gallery Section */}
        {reflections.length > 0 ? (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-slate-200 flex-grow"></div>
                <h2 className="font-serif italic text-slate-400 text-xl">Your Path</h2>
                <div className="h-px bg-slate-200 flex-grow"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {reflections.map((reflection) => (
                 <ReflectionCard 
                   key={reflection.id} 
                   reflection={reflection} 
                   onDelete={deleteReflection}
                   onGenerate={() => handleGeneratePostcard(reflection)}
                 />
               ))}
             </div>
          </section>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-300 font-serif italic text-xl">Your quiet space is waiting...</p>
          </div>
        )}
      </main>

      <footer className="mt-40 text-center pb-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-300">
          Mina • A Private Reflection Space
        </p>
      </footer>
    </div>
  );
};

export default App;
