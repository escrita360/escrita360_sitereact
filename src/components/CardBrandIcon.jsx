/**
 * Componente para exibir indicador da bandeira do cartão
 */

import React from 'react'

const CardBrandIcon = ({ brand, className = '' }) => {
  const getBrandInfo = (brand) => {
    const brands = {
      visa: {
        name: 'Visa',
        color: 'bg-blue-600',
        textColor: 'text-white'
      },
      mastercard: {
        name: 'Mastercard',
        color: 'bg-red-600',
        textColor: 'text-white'
      },
      amex: {
        name: 'Amex',
        color: 'bg-green-600',
        textColor: 'text-white'
      },
      elo: {
        name: 'Elo',
        color: 'bg-yellow-500',
        textColor: 'text-black'
      },
      hipercard: {
        name: 'Hipercard',
        color: 'bg-orange-600',
        textColor: 'text-white'
      },
      discover: {
        name: 'Discover',
        color: 'bg-orange-500',
        textColor: 'text-white'
      },
      jcb: {
        name: 'JCB',
        color: 'bg-blue-800',
        textColor: 'text-white'
      },
      diners: {
        name: 'Diners',
        color: 'bg-purple-600',
        textColor: 'text-white'
      },
      maestro: {
        name: 'Maestro',
        color: 'bg-red-500',
        textColor: 'text-white'
      },
      unknown: {
        name: '?',
        color: 'bg-gray-400',
        textColor: 'text-white'
      }
    }
    
    return brands[brand] || brands.unknown
  }

  const brandInfo = getBrandInfo(brand)

  if (brand === 'unknown' || !brand) {
    return null
  }

  return (
    <div 
      className={`
        inline-flex items-center justify-center
        px-2 py-1 rounded text-xs font-semibold
        ${brandInfo.color} ${brandInfo.textColor}
        ${className}
      `}
    >
      {brandInfo.name}
    </div>
  )
}

export default CardBrandIcon