import { RefObject, useState } from 'react';

export function useDownloadImage(ref: RefObject<HTMLDivElement | null>) {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadImage = async () => {
    if (!ref.current) return;
    setIsGenerating(true);
    try {
      const element = ref.current;
      const { width, height } = element.getBoundingClientRect();

      // Clone the element so we can inline all computed styles
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.width = width + 'px';
      clone.style.background = '#ffffff';
      clone.style.color = '#1a1a1a';
      document.body.appendChild(clone);

      // Convert all images to data URLs
      const images = Array.from(clone.querySelectorAll('img'));
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (!img.src || img.src.startsWith('data:')) {
                resolve();
                return;
              }
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const image = new Image();
              image.crossOrigin = 'anonymous';
              image.onload = () => {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                ctx?.drawImage(image, 0, 0);
                try {
                  img.src = canvas.toDataURL('image/png');
                } catch {
                  // ignore tainted canvas
                }
                resolve();
              };
              image.onerror = () => resolve();
              image.src = img.src;
            })
        )
      );

      // Serialize to SVG foreignObject
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${clone.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      document.body.removeChild(clone);

      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const canvas = document.createElement('canvas');
      const scale = 2; // retina
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(scale, scale);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Failed to render resume as image'));
        };
        img.src = svgUrl;
      });

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resume.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        'image/png',
        1.0
      );
    } catch (err) {
      console.error('Image download failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { downloadImage, isGenerating };
}
