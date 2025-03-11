
import { v4 as uuidv4 } from 'uuid';
import { 
  ElementType, 
  ScrapbookPage, 
  Scrapbook, 
  TextElementData, 
  ImageElementData,
  StickerElementData
} from '@/types/scrapbook';

// Demo images
const demoImages = [
  '/placeholder.svg',
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400',
];

const stickers = [
  'https://cdn-icons-png.flaticon.com/512/6010/6010051.png',
  'https://cdn-icons-png.flaticon.com/512/6941/6941697.png',
  'https://cdn-icons-png.flaticon.com/512/6010/6010244.png',
  'https://cdn-icons-png.flaticon.com/512/6941/6941611.png',
];

// Create a demo page
const createDemoPage = (pageNumber: number): ScrapbookPage => {
  const elements = [];
  
  // Add a title
  elements.push({
    id: uuidv4(),
    type: ElementType.TEXT,
    x: 50,
    y: 30,
    zIndex: 10,
    data: {
      content: `My Memories - Page ${pageNumber}`,
      fontFamily: 'Pacifico, cursive',
      fontSize: 32,
      color: '#765a3e',
    } as TextElementData
  });
  
  // Add some text content
  elements.push({
    id: uuidv4(),
    type: ElementType.TEXT,
    x: 50,
    y: 100,
    zIndex: 5,
    data: {
      content: 'This is a special memory that I want to cherish forever. The day was perfect and filled with joy.',
      fontFamily: 'Dancing Script, cursive',
      fontSize: 18,
      color: '#444444',
    } as TextElementData
  });
  
  // Add an image
  elements.push({
    id: uuidv4(),
    type: ElementType.IMAGE,
    x: 320,
    y: 80,
    zIndex: 3,
    data: {
      src: demoImages[pageNumber % demoImages.length],
      alt: 'Demo image',
      width: 280,
      height: 200,
      rotation: Math.floor(Math.random() * 10) - 5,
    } as ImageElementData
  });
  
  // Add a sticker
  elements.push({
    id: uuidv4(),
    type: ElementType.STICKER,
    x: 280,
    y: 300,
    zIndex: 15,
    data: {
      src: stickers[pageNumber % stickers.length],
      alt: 'Sticker',
      width: 80,
      height: 80,
      rotation: Math.floor(Math.random() * 20) - 10,
    } as StickerElementData
  });
  
  return {
    id: uuidv4(),
    title: `Page ${pageNumber}`,
    background: 'bg-scrapbook-page texture-paper',
    elements,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Create a demo scrapbook
export const demoScrapbook: Scrapbook = {
  id: uuidv4(),
  title: 'My First Scrapbook',
  coverImage: demoImages[0],
  pages: [
    createDemoPage(1),
    createDemoPage(2),
    createDemoPage(3),
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};
