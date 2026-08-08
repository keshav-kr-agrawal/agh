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
    return 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
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
 * Mock Cloudinary Direct Upload Function
 * Accepts File or Base64 and simulates high-speed WebP image upload returning CDN URL
 */
export async function uploadToCloudinary(file: File | string): Promise<string> {
  // Simulate network latency of Cloudinary SDK upload
  await new Promise(res => setTimeout(res, 600));

  if (typeof file === 'string') {
    return file; // If already a string URL
  }

  // Create local object URL preview for uploaded proof / image
  return URL.createObjectURL(file);
}
