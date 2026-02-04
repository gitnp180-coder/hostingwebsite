import React, { useState, useEffect } from 'react';
import { Reflection, VIBES, Postcard } from './types';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [activeVibe, setActiveVibe] = useState(VIBES[0]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [selectedPostcard, setSelectedPostcard] = useState<Postcard | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mina_reflections');
    if (saved) {
      try { setReflections(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newRef = {
      id: Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      vibe: activeVibe.name,
      gradient: activeVibe.color,
      timestamp: Date.now(),
    };
    const updated = [newRef, ...reflections];
    setReflections(updated);
    localStorage.setItem('mina_reflections', JSON.stringify(updated));
    setText('');
  };

  const deleteReflection = (id: string) => {
    const updated = reflections.filter(r => r.id !== id);
    setReflections(updated);
    localStorage.setItem('mina_reflections', JSON.stringify(updated));
  };

  const handleGenerate = (reflection: Reflection) => {
    setIsGenerating(true);
    setTimeout(() => {
      setSelectedPostcard({
        destination: `The Land of ${reflection.vibe}`,
        message: `Your thought: "${reflection.text}" has found its home.`,
        imageUrl: ""
      });
      setIsGenerating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-800 pb-20">
      <nav className="pt-20 pb-12 text-center">
        <h1 className="text-5xl font-serif italic">Mina</h1>
        <div className="h-px w-12 bg-slate-200 mx-auto mt-4"></div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">
        {selectedPostcard && (
          <div className="mb-20 p-10 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
             <h2 className="font-serif italic text-4xl mb-4">{selectedPostcard.destination}</h2>
             <p className="text-slate-500 mb-8">{selectedPostcard.message}</p>
             <button onClick={() => setSelectedPostcard(null)} className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-slate-800">Close Postcard</button>
          </div>
        )}

        {!selectedPostcard && (
          <section className="mb-20 text-center">
            <form onSubmit={handleSave} className="max-w-xl mx-auto space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.3em] font-semibold text-slate-400">What is on your mind?</h3>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write a quiet thought..."
                  className="w-full bg-transparent border-b border-slate-200 focus:border-slate-800 outline-none py-4 text-2xl font-serif italic text-center transition-colors placeholder:text-slate-200 resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Choose your Aura</h3>
                <div className="flex justify-center gap-3">
                  {VIBES.map((v) => (
                    <button key={v.name} type="button" onClick={() => setActiveVibe(v)} className={`w-8 h-8 rounded-full transition-all ${activeVibe.name === v.name ? 'ring-2 ring-slate-400 scale-125' : 'hover:scale-110'}`} style={{ background: v.color }} />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{activeVibe.name}</p>
              </div>

              <button type="submit" disabled={!text.trim()} className="px-12 py-3 rounded-full border border-slate-800 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-20 font-serif">
                Save Reflection
              </button>
            </form>
          </section>
        )}

        {reflections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reflections.map(r => (
              <div key={r.id} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <div className="h-1 w-8 rounded-full" style={{ background: r.gradient }}></div>
                <p className="font-serif italic text-lg text-slate-600">"{r.text}"</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <button onClick={() => handleGenerate(r)} className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Manifest</button>
                  <button onClick={() => deleteReflection(r.id)} className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;