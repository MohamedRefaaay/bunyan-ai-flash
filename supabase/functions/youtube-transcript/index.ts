
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple regex parser for track list to find a language code.
// Prefers 'ar' (Arabic), falls back to the first available track.
const getLangCode = (xml: string): string | null => {
    // Check for Arabic track first
    const arabicMatch = xml.match(/<track[^>]*lang_code="ar"[^>]*\/>/);
    if (arabicMatch) {
      return 'ar';
    }
    
    // Fallback to the first track found
    const anyTrackMatch = xml.match(/<track[^>]*lang_code="([^"]+)"/);
    if (anyTrackMatch && anyTrackMatch[1]) {
      return anyTrackMatch[1];
    }

    return null;
};

// Simple regex parser for transcript XML. It extracts text content from <text> tags.
const parseTranscript = (xml: string): string => {
    const matches = xml.matchAll(/<text[^>]*>([^<]+)<\/text>/g);
    // Join all text parts and decode common HTML entities.
    return Array.from(matches, m => m[1])
        .join(' ')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { videoId } = await req.json();
    if (!videoId) {
      throw new Error("معرّف الفيديو مطلوب.");
    }

    const listResponse = await fetch(`https://video.google.com/timedtext?v=${videoId}&type=list`);
    if (!listResponse.ok) {
        // If no transcript list is available, it might be a video without captions.
        if (listResponse.status === 404) {
            throw new Error("لم يتم العثور على قائمة نصوص لهذا الفيديو. قد لا يحتوي على ترجمات.");
        }
        throw new Error('فشل في جلب قائمة النصوص.');
    }
    const listXml = await listResponse.text();
    
    // If listXml is empty, it means no captions are available.
    if (!listXml) {
        throw new Error("لم يتم العثور على نص لهذا الفيديو. قد يكون منشئ المحتوى قد عطله.");
    }
    
    const lang = getLangCode(listXml);
    if (!lang) {
      throw new Error("لم يتم العثور على نص لهذا الفيديو. قد يكون منشئ المحتوى قد عطله.");
    }
    
    const transcriptResponse = await fetch(`https://video.google.com/timedtext?v=${videoId}&lang=${lang}&type=track`);
    if (!transcriptResponse.ok) {
        throw new Error('فشل في جلب النص.');
    }
    const transcriptXml = await transcriptResponse.text();

    const texts = parseTranscript(transcriptXml);
    
    const videoInfoResponse = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    let videoInfo = { title: 'عنوان غير معروف', author_name: 'مؤلف غير معروف' };
    if (videoInfoResponse.ok) {
        videoInfo = await videoInfoResponse.json();
    }

    return new Response(JSON.stringify({ transcript: texts, title: videoInfo.title }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("YouTube Transcript Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
