'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function GalleryUploader() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []);
    setFiles(list);
    setPreviews(list.map((f) => URL.createObjectURL(f)));
  }

  function removePreview(i: number) {
    setFiles(files.filter((_, idx) => idx !== i));
    setPreviews(previews.filter((_, idx) => idx !== i));
  }

  async function upload() {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const supabase = createClient();
      let count = 0;
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from('gallery')
          .upload(path, file);
        if (error) throw error;
        const { data: url } = supabase.storage.from('gallery').getPublicUrl(path);
        const { error: dbErr } = await supabase.from('gallery_items').insert({
          title: title || null,
          category: category || null,
          image_url: url.publicUrl,
        });
        if (dbErr) throw dbErr;
        count++;
      }
      toast.success(`${count} imagem(ns) enviada(s)`);
      setFiles([]);
      setPreviews([]);
      setTitle('');
      setCategory('');
      if (inputRef.current) inputRef.current.value = '';
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-paper border border-border rounded-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Título (opcional, aplica a todas)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2.5 text-sm border border-border rounded-sm focus:outline-none focus:border-gold min-h-[44px]"
        />
        <input
          type="text"
          placeholder="Categoria (ex: treino, jogo)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 text-sm border border-border rounded-sm focus:outline-none focus:border-gold min-h-[44px]"
        />
      </div>

      <div className="border-2 border-dashed border-border rounded-sm p-8 text-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelect}
          className="hidden"
          id="gallery-upload"
        />
        <label
          htmlFor="gallery-upload"
          className="cursor-pointer inline-flex flex-col items-center gap-3 text-ink-mid hover:text-gold transition-colors"
        >
          <Upload size={32} />
          <span className="text-sm font-semibold">Clique para selecionar imagens</span>
          <span className="text-xs">Você pode selecionar várias de uma vez</span>
        </label>
      </div>

      {previews.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square bg-ink-soft rounded-sm overflow-hidden group">
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-1 right-1 p-1 bg-ink/80 text-paper rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={upload}
            disabled={uploading}
            className="btn btn-gold"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Enviando...' : `Enviar ${files.length} imagem(ns)`}
          </button>
        </div>
      )}
    </div>
  );
}
