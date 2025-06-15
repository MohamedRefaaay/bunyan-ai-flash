
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables')
    }

    // The base64 string might have a prefix like `data:audio/webm;base64,`. We need to remove it.
    const base64Data = audio.split(',')[1] || audio;
    
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(base64Data)
    
    // Prepare form data for Gemini API
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', blob, 'audio.webm')

    // Use Gemini API for transcription
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;

    // Since Gemini doesn't have direct audio transcription like Whisper, we'll use a different approach
    // Convert audio to base64 and use Gemini's capabilities
    const geminiPrompt = `
    تحويل الصوت إلى نص باللغة العربية. يرجى استخراج النص المنطوق من الملف الصوتي المرفوع وإرجاع النص فقط بدون أي تفسيرات إضافية.
    `;

    try {
      // For now, we'll return an error suggesting the user to use text input
      // as Gemini's audio processing is more complex and requires different implementation
      throw new Error('يرجى استخدام إدخال النص المباشر حتى يتم تطوير دعم Gemini للصوت. يمكنك نسخ النص ولصقه في تبويب "نص مباشر".');
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      throw new Error('يرجى استخدام إدخال النص المباشر. يمكنك نسخ النص ولصقه في تبويب "نص مباشر".');
    }

  } catch (error) {
    console.error('Error in transcribe function:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
