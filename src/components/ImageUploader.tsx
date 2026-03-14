import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { uploadImageToGitHub } from '../services/github';

type ImageUploaderProps = {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  onClear?: () => void;
  githubToken: string;
  label?: string;
};

export function ImageUploader({ currentImageUrl, onUploadSuccess, onClear, githubToken, label = "Upload Image" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!githubToken) {
      setError("Please configure GitHub Token in the Publish dialog first");
      return;
    }
    
    setIsUploading(true);
    setError(null);

    try {
      // Create an Image object to read the file
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      // Max dimension
      const MAX_WIDTH = 1920;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      // Draw to canvas for compression & JPG conversion
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      // Fill with white background (in case of transparent PNG)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      // Convert to JPG blob (85% quality)
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
      if (!blob) throw new Error("Could not convert image to JPG");

      // Read blob as ArrayBuffer for the API
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // Upload to GitHub
      const newFilename = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
      const uploadedUrl = await uploadImageToGitHub(bytes, newFilename, githubToken, 'Taurng', 'cg-cangwood');
      
      onUploadSuccess(uploadedUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div 
        className={`relative border-2 border-dashed transition-all w-full flex flex-col items-center justify-center p-6 bg-gray-50/50 cursor-pointer overflow-hidden ${
          isDragging ? 'border-brand-black bg-gray-100' : 'border-brand-black/20 hover:border-brand-black/50'
        } ${currentImageUrl ? 'h-48' : 'h-32'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
            e.target.value = ''; // Reset input
          }}
        />

        {currentImageUrl ? (
          <>
            <img src={currentImageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-brand-black/20 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <UploadCloud className="w-8 h-8 text-white mb-2" />
              <span className="font-mono text-[10px] text-white bg-brand-black px-2 py-1">Click or Drop to Replace</span>
            </div>
          </>
        ) : (
          <>
            <ImageIcon className="w-8 h-8 text-brand-darkgray/50 mb-3" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-darkgray font-semibold mb-1">{label}</span>
            <span className="font-mono text-[9px] text-brand-darkgray/60">Click or Drag & Drop (Auto JPG compress)</span>
          </>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-brand-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-black mb-2" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Uploading...</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start">
        {error ? (
          <span className="font-mono text-[9px] text-red-500">{error}</span>
        ) : currentImageUrl ? (
          <span className="font-mono text-[9px] text-green-600 truncate mr-2" title={currentImageUrl}>Added: {currentImageUrl}</span>
        ) : (
          <span className="font-mono text-[9px] text-brand-darkgray/60"></span>
        )}
        
        {currentImageUrl && onClear && (
          <button 
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-red-500 hover:text-red-700 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 shrink-0 bg-red-50 px-2 py-0.5"
            disabled={isUploading}
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>
    </div>
  );
}
