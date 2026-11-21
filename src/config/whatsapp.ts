export const whatsapp = {
  number: '5531984244285',
  message: 'Olá! ☕ Vim pelo site do Café com Letras e gostaria de saber mais informações. 😊',
} as const;

export const whatsappContexts = ['Home', 'Gastronomia', 'Programação', 'Evento', 'Livraria', 'A Casa', 'Home no celular', 'Trabalhe conosco', 'Imprensa'] as const;
export type WhatsAppContext = typeof whatsappContexts[number];
export function whatsappMessage(context?: WhatsAppContext) {
  return context ? `Olá! Vim pela página ${context} do Café com Letras e gostaria de mais informações.` : whatsapp.message;
}

// The direct official endpoint preserves emoji that the wa.me redirect can replace.
export const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsapp.number}&text=${encodeURIComponent(whatsapp.message)}`;
