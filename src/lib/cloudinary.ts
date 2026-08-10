/**
 * Cloudinary SDK Helper & Responsive Image Optimization Wrapper
 */

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  quality?: 'auto' | number;
  format?: 'webp' | 'auto' | 'jpg';
}

export function getOptimizedImageUrl(
  originalUrl: string,
  options: CloudinaryOptions = {}
): string {
  if (!originalUrl) {
    return '';
  }

  // If base64 data URL, return directly
  if (originalUrl.startsWith('data:image')) {
    return originalUrl;
  }

  // If already Cloudinary URL, inject transformations
  if (originalUrl.includes('res.cloudinary.com')) {
    const { width = 800, crop = 'fill', quality = 'auto', format = 'webp' } = options;
    const transform = `c_${crop},w_${width},q_${quality},f_${format}`;
    return originalUrl.replace('/upload/', `/upload/${transform}/`);
  }

  // If Unsplash URL, append quality & webp params
  if (originalUrl.includes('images.unsplash.com')) {
    const w = options.width || 800;
    return `${originalUrl.split('?')[0]}?auto=format&fit=crop&w=${w}&q=80&fm=webp`;
  }

  return originalUrl;
}

/**
 * Cloudinary Image Deletion API Helper
 */
export async function deleteFromCloudinary(publicIdOrUrl: string): Promise<boolean> {
  if (!publicIdOrUrl) return false;
  try {
    const res = await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId: publicIdOrUrl, url: publicIdOrUrl })
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return false;
  }
}

/**
 * Client-side Canvas Image Compressor
 * Resizes large photos to max 1200px and 80% JPEG quality to ensure fast Cloudinary upload & lightweight fallbacks
 */
export async function compressImage(fileOrDataUrl: File | string, maxWidth = 1200, quality = 0.8): Promise<string> {
  if (typeof window === 'undefined') {
    if (typeof fileOrDataUrl === 'string') return fileOrDataUrl;
    return '';
  }

  return new Promise<string>((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } else {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : img.src);
      }
    };

    img.onerror = () => {
      if (typeof fileOrDataUrl === 'string') resolve(fileOrDataUrl);
      else resolve('');
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * Real Cloudinary Direct Upload Function
 * Accepts File or Base64, compresses image, and uploads to Cloudinary CDN returning permanent URL
 */
export async function uploadToCloudinary(file: File | string): Promise<string> {
  if (!file) return '';
  if (typeof file === 'string' && file.startsWith('http')) return file;

  try {
    const base64String = await compressImage(file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64String })
    });
    const json = await res.json();
    if (json.success && json.url) {
      if (json.provider === 'fallback_data_url') {
        console.warn('Cloudinary upload warning: Saved as compressed image fallback. Configure CLOUDINARY_API_KEY & CLOUDINARY_API_SECRET or upload_preset on Cloudinary Console for Cloudinary CDN URL.');
      }
      return json.url;
    }
  } catch (err) {
    console.error('Cloudinary API upload error:', err);
  }

  if (typeof file === 'string') return file;
  return compressImage(file);
}

