// src/global.d.ts
declare global {
  interface TelegramWebApp {
    ready: () => void;
    expand: () => void; // expand funksiyasini qo'shish
    close?: () => void; // close metodini optional qilib qo'shamiz
    initDataUnsafe: {
      user?: {
        username?: string;
      };
    };
  }

  interface Window {
    Telegram: {
      WebApp: TelegramWebApp; // Faqat TelegramWebApp interfeysidan foydalanamiz
    };
  }
}

export {};

// src/global.d.ts

interface TelegramWebApp {
  expand: () => void;
  // Boshqa funksiyalarni ham bu yerga qo'shishingiz mumkin
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}

