import type { ReactNode } from 'react';

export interface QrItem {
  name: string;
  url: string;
  qr: string;
  icon: ReactNode;
}

let preloaded = false;

/** Starts downloading the QR images so the dialog opens instantly (called on hover/focus of the trigger). */
export function preloadQrImages(items: QrItem[]) {
  if (preloaded) return;
  preloaded = true;
  items.forEach((item) => {
    new Image().src = item.qr;
  });
}
