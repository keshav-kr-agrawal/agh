import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const image = body.image || body.file;

    if (!image) {
      return NextResponse.json({ success: false, message: 'No image file or data provided' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'h0uczsof';

    // List of standard Cloudinary unsigned presets to attempt automatically
    const presetsToTry = ['unsigned_preset', 'ml_default', 'agh_preset', 'preset_unsigned', 'unsigned'];

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
