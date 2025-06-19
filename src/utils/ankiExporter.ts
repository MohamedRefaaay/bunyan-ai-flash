
import type { Flashcard } from '@/types/flashcard';

export interface AnkiCard {
  front: string;
  back: string;
  tags: string;
  deck: string;
}

export const exportToAnki = async (flashcards: Flashcard[], deckName: string = 'Bunyan AI Cards') => {
  // Convert flashcards to Anki format
  const ankiCards: AnkiCard[] = flashcards.map(card => ({
    front: card.front,
    back: card.back,
    tags: card.tags ? card.tags.join(' ') : 'bunyan_ai',
    deck: deckName
  }));

  // Create CSV content for Anki import
  const csvHeader = 'Front,Back,Tags,Deck\n';
  const csvContent = ankiCards.map(card => {
    // Escape quotes and handle line breaks
    const escapeCsv = (text: string) => {
      if (text.includes('"') || text.includes(',') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    return [
      escapeCsv(card.front),
      escapeCsv(card.back),
      escapeCsv(card.tags),
      escapeCsv(card.deck)
    ].join(',');
  }).join('\n');

  const fullCsvContent = csvHeader + csvContent;

  // Create and download the file
  const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${deckName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}_anki_cards.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportToAnkiJson = async (flashcards: Flashcard[], deckName: string = 'Bunyan AI Cards') => {
  const ankiDeck = {
    name: deckName,
    cards: flashcards.map((card, index) => ({
      id: card.id || `card_${index}`,
      front: card.front,
      back: card.back,
      tags: card.tags || ['bunyan_ai'],
      difficulty: card.difficulty,
      created_at: card.created_at || new Date().toISOString(),
      signature: card.signature || '📘 Made with Bunyan_AI'
    })),
    metadata: {
      source: 'Bunyan AI',
      exported_at: new Date().toISOString(),
      total_cards: flashcards.length,
      version: '1.0'
    }
  };

  const jsonContent = JSON.stringify(ankiDeck, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${deckName.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}_bunyan_deck.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
