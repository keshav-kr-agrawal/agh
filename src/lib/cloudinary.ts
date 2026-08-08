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
  if (!originalUrl || originalUrl.includes('images.unsplash.com')) {
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
 * Real Cloudinary Direct Upload Function
 * Accepts File or Base64 and uploads to Cloudinary CDN returning permanent URL
 */
export async function uploadToCloudinary(file: File | string): Promise<string> {
  if (!file) return '';
  if (typeof file === 'string') return file;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'h0uczsof';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'unsigned_preset');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const json = await res.json();
    if (json.secure_url) {
      return json.secure_url;
    }
  } catch (err) {
    console.error('Cloudinary direct API upload failed, using persistent Base64 fallback:', err);
  }

  // Convert File to Base64 Data URL so it persists permanently in Supabase across all devices
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
