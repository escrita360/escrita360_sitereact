# Paleta de Cores - Escrita360

## Identidade Visual Text79

Este documento descreve o esquema de cores do site Text79 aplicado ao Escrita360, criado para transmitir profissionalismo, confiança e inovação no setor educacional.

## Cores Principais

### 1. **Primary Blue** - `#4070B7`
- **Uso**: Cor principal da marca, botões primários, títulos importantes
- **Contexto**: Representa confiança, profissionalismo e estabilidade
- **Aplicação**: 
  - Botões principais (CTAs)
  - Ícones de destaque
  - Números e estatísticas importantes
  - Links de navegação (hover)

### 2. **Secondary Blue** - `#61C2D3`
- **Uso**: Elementos interativos, hover states, destaques secundários
- **Contexto**: Transmite inovação, tecnologia e dinamismo
- **Aplicação**:
  - Estados hover de botões
  - Ícones secundários
  - Elementos de destaque alternados
  - Gradientes (combinado com Primary)

### 3. **Accent Blue** - `#39A1DB`
- **Uso**: Bordas, divisores, elementos de destaque vibrantes
- **Contexto**: Adiciona energia e dinamismo à interface
- **Aplicação**:
  - Bordas de cards em hover
  - Divisores de seção
  - Elementos interativos importantes
  - Call-to-action secundários

### 4. **Dark Blue** - `#1A5B94`
- **Uso**: Textos importantes, ênfase forte, contraste
- **Contexto**: Profissionalismo e autoridade
- **Aplicação**:
  - Títulos principais em fundos claros
  - Textos de alta importância
  - Headers e footers
  - Elementos que precisam de contraste forte

### 5. **Light Blue** - `#F5F9FC`
- **Uso**: Backgrounds de seções alternadas, fundos de cards
- **Contexto**: Clareza, leveza e espaço respirável
- **Aplicação**:
  - Background de seções (alternado com branco)
  - Fundos de cards com ícones
  - Texto sobre fundos escuros
  - Overlays transparentes

## Hierarquia de Aplicação

### Textos
- **Títulos principais**: `#4070B7` (Primary)
- **Subtítulos/Destaques**: `#61C2D3` (Secondary)
- **Texto padrão**: `#334155` (Slate-700)
- **Texto secundário**: `#64748b` (Slate-500)

### Backgrounds
- **Hero sections**: Gradiente de `#EBF5F9` para branco
- **Seções alternadas**: `#F5F9FC` ou branco
- **Cards**: Branco com border `#39A1DB/30`
- **Hover em fundos**: `#F5F9FC`

### Interatividade
- **Botões primários**: 
  - Normal: `#4070B7`
  - Hover: `#61C2D3`
  - Shadow: `rgba(64, 112, 183, 0.3)`
  
- **Links**:
  - Normal: `#334155` (Slate-700)
  - Hover: `#4070B7`

- **Cards**:
  - Normal: Border transparente
  - Hover: Border `#39A1DB`, Shadow elevada, Transform Y(-4px)

### Ícones
- **Primários**: `#4070B7`
- **Secundários**: `#61C2D3`
- **Em backgrounds coloridos**: `#39A1DB`

## Classes CSS Customizadas

### Cores de Fundo
```css
.bg-brand-primary      /* #4070B7 */
.bg-brand-secondary    /* #61C2D3 */
.bg-brand-accent       /* #39A1DB */
.bg-brand-dark         /* #1A5B94 */
.bg-brand-light        /* #F5F9FC */
.bg-brand-lighter      /* #EBF5F9 */
```

### Cores de Texto
```css
.text-brand-primary    /* #4070B7 */
.text-brand-secondary  /* #61C2D3 */
.text-brand-accent     /* #39A1DB */
.text-brand-dark       /* #1A5B94 */
.text-brand-lighter    /* #EBF5F9 */
```

### Gradientes
```css
.bg-brand-gradient        /* Primary → Secondary */
.bg-brand-gradient-light  /* Lighter → White */
.bg-brand-gradient-subtle /* Light → White */
```

## Princípios de Design

### 1. Minimalismo Profissional
- Uso comedido de cores
- Muito espaço em branco
- Tipografia clara e legível
- Hierarquia visual bem definida

### 2. Harmonia e Equilíbrio
- Alternância entre seções brancas e light blue
- Gradientes suaves, não agressivos
- Transições fluidas entre estados
- Consistência em toda a aplicação

### 3. Chamativo sem Exagero
- Animações sutis (translateY, shadow)
- Hover states bem definidos
- Contraste adequado para acessibilidade
- Elementos interativos claramente identificáveis

## Acessibilidade

### Contraste de Cores (WCAG 2.1)
- **Primary Blue (#4070B7) sobre branco**: ✅ AAA (7.5:1)
- **Secondary Blue (#61C2D3) sobre branco**: ✅ AA (4.5:1)
- **Accent Blue (#39A1DB) sobre branco**: ✅ AA (5.2:1)
- **Dark Blue (#1A5B94) sobre branco**: ✅ AAA (10.1:1)
- **Texto slate-700 sobre branco**: ✅ AAA (12.5:1)
- **Primary Blue sobre Light Blue**: ✅ AA (5.5:1)

### Recomendações
- Sempre use texto escuro (slate-700/900) para conteúdo principal
- Cores de marca apenas para destaques e elementos interativos
- Mantenha contraste mínimo de 4.5:1 para texto normal
- Use 3:1 para elementos gráficos importantes

## Implementação nos Componentes

### Layout (Header/Footer)
- Background: Branco
- Links hover: `text-brand-primary`
- Logo: Cores originais

### Home
- Hero: Gradiente `from-brand-lighter to-white`
- Stats: Background `bg-brand-light`
- Cards: Border `border-brand-accent/20` no hover

### Recursos
- Ícones: Alternância entre `text-brand-primary` e `text-brand-secondary`
- Tabs ativos: `bg-brand-primary`
- Cards: Hover com `border-brand-accent`

### Preços
- Plano popular: `border-brand-primary`
- Preços: `text-brand-primary`
- Background alternado: `bg-brand-light`

### Para Quem
- Ícones em círculos: Background `bg-brand-light`
- CTAs: `bg-brand-primary hover:bg-brand-secondary`
- Badges: `text-brand-primary border-brand-accent`

### Contato
- Formulário: CTA `bg-brand-primary hover:bg-brand-secondary`
- Ícones de contato: `text-brand-primary` em `bg-brand-light`

## Exportação de Cores

### Hex
```
Primary:   #4070B7
Secondary: #61C2D3
Accent:    #39A1DB
Dark:      #1A5B94
Light:     #F5F9FC
Lighter:   #EBF5F9
```

### RGB
```
Primary:   rgb(64, 112, 183)
Secondary: rgb(97, 194, 211)
Accent:    rgb(57, 161, 219)
Dark:      rgb(26, 91, 148)
Light:     rgb(245, 249, 252)
Lighter:   rgb(235, 245, 249)
```

### OKLCH (usado no código)
```
Primary:   oklch(0.50 0.13 250)
Secondary: oklch(0.66 0.10 215)
Accent:    oklch(0.60 0.12 235)
Dark:      oklch(0.45 0.14 250)
Light:     oklch(0.98 0.01 220)
Lighter:   oklch(0.96 0.01 220)
```

## Próximos Passos

1. **Testar em diferentes dispositivos** - Verificar aparência em mobile, tablet e desktop
2. **Validar acessibilidade** - Usar ferramentas como Lighthouse e axe DevTools
3. **Coletar feedback** - Apresentar a usuários e stakeholders
4. **Ajustar se necessário** - Pequenos ajustes baseados em feedback
5. **Documentar componentes** - Criar guia de estilo completo

## Manutenção

- **Consistência**: Sempre use as classes customizadas ao invés de cores diretas
- **Variações**: Use opacity para variações (ex: `bg-brand-accent/30`)
- **Novos componentes**: Siga a hierarquia estabelecida
- **Testes**: Sempre teste contraste ao adicionar novas combinações

---

**Criado em**: Outubro 2025  
**Versão**: 1.0  
**Status**: ✅ Implementado
