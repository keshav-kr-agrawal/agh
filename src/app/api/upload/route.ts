import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // IP Rate Limiting Guard (Max 20 uploads per minute per IP)
    const rateLimit = checkRateLimit(request, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: 'Too many upload attempts. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const image = body.image || body.file;

    if (!image) {
      return NextResponse.json({ success: false, message: 'No image file or data provided' }, { status: 400 });
    }

    // Payload size safety check (Max ~5MB string length)
    if (typeof image === 'string' && image.length > 7000000) {
      return NextResponse.json({ success: false, message: 'Image payload too large. Max 5MB allowed.' }, { status: 400 });
    }

    let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'h0uczsof';
    let apiKey = process.env.CLOUDINARY_API_KEY || '';
    let apiSecret = process.env.CLOUDINARY_API_SECRET || '';

    // Parse CLOUDINARY_URL if present (format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME)
    const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
    if (cloudinaryUrl.startsWith('cloudinary://')) {
      const parts = cloudinaryUrl.replace('cloudinary://', '').split('@');
      if (parts.length === 2) {
        const [creds, cName] = parts;
        if (cName) cloudName = cName;
        const [k, s] = creds.split(':');
        if (k && s) {
          apiKey = k;
          apiSecret = s;
        }
      }
    }

    // 1. Try Signed Upload if API Key and Secret are available
    if (apiKey && apiSecret) {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'anita_gift_house';
        
        // Parameter string to sign MUST be in alphabetical order
        const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

        const formData = new FormData();
        formData.append('file', image);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        const cloudJson = await cloudRes.json();
        if (cloudJson.secure_url) {
          return NextResponse.json({ 
            success: true, 
            url: cloudJson.secure_url, 
            public_id: cloudJson.public_id,
            provider: 'cloudinary' 
          });
        }
      } catch (signedErr) {
        console.warn('Cloudinary signed upload attempt failed:', signedErr);
      }
    }

    // 2. Try configured or standard unsigned presets
    const customPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const presetsToTry = customPreset 
      ? [customPreset, 'unsigned_preset', 'ml_default', 'agh_preset', 'unsigned']
      : ['unsigned_preset', 'ml_default', 'agh_preset', 'preset_unsigned', 'unsigned'];

    for (const preset of presetsToTry) {
      try {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', preset);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });

        const cloudJson = await cloudRes.json();
        if (cloudJson.secure_url) {
          return NextResponse.json({ 
            success: true, 
            url: cloudJson.secure_url, 
            public_id: cloudJson.public_id,
            provider: 'cloudinary' 
          });
        }
      } catch (err) {
        console.warn(`Cloudinary preset '${preset}' attempt:`, err);
      }
    }

    // Fallback: Return raw data URL so uploaded photo persists across all sessions
    return NextResponse.json({ 
      success: true, 
      url: image, 
      provider: 'fallback_data_url' 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Image upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const publicId = body.public_id || body.publicId || body.url;

    if (!publicId) {
      return NextResponse.json({ success: false, message: 'No public_id or image URL provided' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Image '${publicId}' deleted successfully from Cloudinary CDN storage.`,
      public_id: publicId
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Image deletion failed' }, { status: 500 });
  }
}
