import type { Product } from '../types';

// Número do WhatsApp (defina seu número aqui com código do país, ex: 5511999999999)
const WHATSAPP_NUMBER = '5542984230849';

export const generateWhatsAppLink = (product: Product): string => {
    const message = `Olá! Gostaria de solicitar um orçamento para a seguinte peça:\n\n📦 *Produto:* ${product.title}\n📂 *Categoria:* ${product.category}\n💰 *Preço de referência:* ${product.price}\n\n${product.description}\n\nPoderia me passar mais informações sobre como fazer a encomenda?\n\nObrigado(a)!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const openWhatsApp = (product: Product) => {
    const link = generateWhatsAppLink(product);
    window.open(link, '_blank');
};
