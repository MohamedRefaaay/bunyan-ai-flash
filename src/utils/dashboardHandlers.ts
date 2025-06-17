
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Flashcard } from '@/types/flashcard';

export const createFileSession = async (fileName: string) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({ title: fileName, source_type: 'audio' })
      .select('id')
      .single();

    if (error) throw error;
    
    if (data?.id) {
      toast.success(`تم إنشاء جلسة للملف: ${fileName}`);
      return data.id;
    }
  } catch (error) {
    console.error('Error creating session:', error);
    toast.error('فشل إنشاء جلسة للملف الصوتي.');
    return null;
  }
};

export const updateSessionTranscript = async (sessionId: string, transcript: string) => {
  try {
    const { error } = await supabase
      .from('sessions')
      .update({ transcript, status: 'transcribed' })
      .eq('id', sessionId);
    
    if (error) throw error;
    toast.success('تم حفظ النص بنجاح في الجلسة.');
  } catch (error) {
    console.error('Error updating session with transcript:', error);
    toast.error('فشل حفظ النص.');
  }
};

export const createDocumentSession = async (content: string, name: string) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({ 
        title: name, 
        source_type: 'document',
        transcript: content,
        status: 'transcribed'
      })
      .select('id')
      .single();

    if (error) throw error;
    
    if (data?.id) {
      toast.success(`تم إنشاء جلسة للمستند: ${name}`);
      return data.id;
    }
  } catch (error) {
    console.error('Error creating session for document:', error);
    toast.error('فشل إنشاء جلسة للمستند.');
    return null;
  }
};

export const createYouTubeSession = async (title: string, url: string, transcript: string, summary: string) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        title,
        source_type: 'youtube',
        source_url: url,
        transcript,
        summary,
        status: 'summarized'
      })
      .select('id')
      .single();

    if (error) throw error;
    
    if (data?.id) {
      toast.success(`تم إنشاء جلسة للفيديو: ${title}`);
      return data.id;
    }
  } catch (error) {
    console.error('Error creating session for YouTube video:', error);
    toast.error('فشل إنشاء جلسة للفيديو.');
    return null;
  }
};

export const saveFlashcards = async (flashcards: Flashcard[], sessionId: string) => {
  try {
    const flashcardsToInsert = flashcards.map(card => ({
      front: card.front,
      back: card.back,
      type: card.type || "basic",
      difficulty: card.difficulty,
      tags: card.tags || [],
      session_id: sessionId,
    }));

    const { data: insertedFlashcards, error: insertError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert)
      .select();

    if (insertError) throw insertError;

    if (insertedFlashcards) {
      toast.success(`تم إنشاء وحفظ ${insertedFlashcards.length} بطاقة تعليمية!`);
      return insertedFlashcards as Flashcard[];
    }
  } catch (error) {
    console.error('Error saving flashcards:', error);
    toast.error('حدث خطأ في حفظ البطاقات.');
    return null;
  }
};

export const updateFlashcard = async (updatedCard: Flashcard) => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({
        front: updatedCard.front,
        back: updatedCard.back,
        difficulty: updatedCard.difficulty,
        type: updatedCard.type,
        tags: updatedCard.tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', updatedCard.id);

    if (error) throw error;
    toast.success('تم تحديث البطاقة بنجاح!');
    return true;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    toast.error('فشل تحديث البطاقة.');
    return false;
  }
};
