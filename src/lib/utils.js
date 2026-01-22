import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  // Converte para número se for string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Formata com 2 casas decimais
  const formatted = numPrice.toFixed(2);

  // Adiciona separador de milhares (ponto) para valores >= 1000
  const [integerPart, decimalPart] = formatted.split('.');

  // Adiciona ponto como separador de milhares
  const integerWithThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${integerWithThousands},${decimalPart}`;
}

export function formatPriceValue(price) {
  // Converte para número se for string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  // Formata com 2 casas decimais
  const formatted = numPrice.toFixed(2);

  // Adiciona separador de milhares (ponto) para valores >= 1000
  const [integerPart, decimalPart] = formatted.split('.');

  // Adiciona ponto como separador de milhares
  const integerWithThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${integerWithThousands},${decimalPart}`;
}
