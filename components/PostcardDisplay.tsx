
import React from 'react';
import { Postcard } from '../types';

interface PostcardDisplayProps {
  postcard: Postcard;
}

const PostcardDisplay: React.FC<PostcardDisplayProps> = ({ postcard }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 perspective-1000">
      <div className="bg-white p-4 shadow-2xl rounded-sm border-8 border-white animate-float">
        {/* Front of Postcard: The Image */}
        <div className="relative group">
          <img 
            src={postcard.imageUrl} 
            alt={postcard.destination} 
            className="w-full h-[400px] object-cover rounded-sm grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm px-4 py-2 text-white border-l-4 border-emerald-400">
            <h3 className="text-2xl font-serif italic">{postcard.destination}</h3>
          </div>
        </div>

        {/* Back of Postcard: The Writing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-slate-200">
          <div className="pr-0 md:pr-8 border-r-0 md:border-r border-slate-200 min-h-[150px]">
            <p className="font-serif text-2xl leading-relaxed text-slate-700 italic">
              "{postcard.message}"
            </p>
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex justify-end">
              <div className="w-20 h-24 border-2 border-slate-300 rounded flex items-center justify-center text-slate-400 text-xs text-center p-2 uppercase tracking-widest">
                Place Stamp Here
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="h-[1px] bg-slate-200 w-full"></div>
              <div className="h-[1px] bg-slate-200 w-full"></div>
              <div className="h-[1px] bg-slate-200 w-full"></div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 text-right">
                Sent via Aetheria Engine
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostcardDisplay;
