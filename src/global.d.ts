// src/global.d.ts
declare global {
  interface TelegramWebApp {
    ready: () => void;
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
