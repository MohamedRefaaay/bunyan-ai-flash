
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
        throw new Error('فشل في جلب قائمة النصوص.');
    }
    const listXml = await listResponse.text();
    
    const listDoc = new DOMParser().parseFromString(listXml, "text/xml");
    if (!listDoc) {
         throw new Error('فشل في تحليل قائمة النصوص.');
    }

    const track = listDoc.querySelector('track[lang_code="ar"], track');
    if (!track) {
      throw new Error("لم يتم العثور على نص لهذا الفيديو. قد يكون منشئ المحتوى قد عطله.");
    }

    const lang = track.getAttribute('lang_code') || 'en';
    
    const transcriptResponse = await fetch(`https://video.google.com/timedtext?v=${videoId}&lang=${lang}&type=track`);
    if (!transcriptResponse.ok) {
        throw new Error('فشل في جلب النص.');
    }
    const transcriptXml = await transcriptResponse.text();

    const doc = new DOMParser().parseFromString(transcriptXml, "text/xml");
    if(!doc) {
        throw new Error('فشل في تحليل النص.');
    }

    const texts = [...doc.querySelectorAll('text')].map(t => t.textContent).join(' ');
    
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
