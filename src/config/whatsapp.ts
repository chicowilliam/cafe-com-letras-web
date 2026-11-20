export const whatsapp = {
  number: '5531984244285',
  message: 'Olá! ☕ Vim pelo site do Café com Letras e gostaria de saber mais informações. 😊',
} as const;

// The direct official endpoint preserves emoji that the wa.me redirect can replace.
export const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsapp.number}&text=${encodeURIComponent(whatsapp.message)}`;
