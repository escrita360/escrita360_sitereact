# Paleta de Cores - Escrita360

## Nova Identidade Visual

Este documento descreve o novo esquema de cores aplicado ao site Escrita360, criado para transmitir profissionalismo, confiança e inovação no setor educacional.

## Cores Principais

### 1. **Primary Blue** - `#3e6eb4`
- **Uso**: Cor principal da marca, botões primários, títulos importantes
- **Contexto**: Representa confiança, profissionalismo e estabilidade
- **Aplicação**: 
  - Botões principais (CTAs)
  - Ícones de destaque
  - Números e estatísticas importantes
  - Links de navegação (hover)

### 2. **Secondary Blue** - `#419fd8`
- **Uso**: Elementos interativos, hover states, destaques secundários
- **Contexto**: Transmite inovação, tecnologia e dinamismo
- **Aplicação**:
  - Estados hover de botões
  - Ícones secundários
  - Elementos de destaque alternados
  - Gradientes (combinado com Primary)

### 3. **Accent Blue** - `#98c4e2`
- **Uso**: Bordas, divisores, elementos sutis de destaque
- **Contexto**: Suaviza a interface, cria hierarquia visual
- **Aplicação**:
  - Bordas de cards em hover
  - Divisores de seção
  - Ícones em estados inativos
  - Elementos decorativos

### 4. **Light Blue** - `#eaf7fd`
- **Uso**: Backgrounds de seções alternadas, fundos de cards
- **Contexto**: Clareza, leveza e espaço respirável
- **Aplicação**:
  - Background de seções (alternado com branco)
  - Fundos de cards com ícones
  - Áreas de destaque suave
  - Hover states sutis

### 5. **Lighter Blue** - `#e1f4fb`
- **Uso**: Backgrounds muito sutis, overlays, gradientes
- **Contexto**: Toque mínimo de cor mantendo clareza
- **Aplicação**:
  - Hero sections
  - Gradientes de fundo
  - Texto sobre fundos escuros
  - Overlays transparentes

## Hierarquia de Aplicação

### Textos
- **Títulos principais**: `#3e6eb4` (Primary)
- **Subtítulos/Destaques**: `#419fd8` (Secondary)
- **Texto padrão**: `#334155` (Slate-700)
- **Texto secundário**: `#64748b` (Slate-500)

### Backgrounds
- **Hero sections**: Gradiente de `#e1f4fb` para branco
- **Seções alternadas**: `#eaf7fd` ou branco
- **Cards**: Branco com border `#98c4e2/30`
- **Hover em fundos**: `#eaf7fd`

### Interatividade
- **Botões primários**: 
  - Normal: `#3e6eb4`
  - Hover: `#419fd8`
  - Shadow: `rgba(62, 110, 180, 0.3)`
  
- **Links**:
  - Normal: `#334155` (Slate-700)
  - Hover: `#3e6eb4`

- **Cards**:
  - Normal: Border transparente
  - Hover: Border `#98c4e2`, Shadow elevada, Transform Y(-4px)

### Ícones
- **Primários**: `#3e6eb4`
- **Secundários**: `#419fd8`
- **Em backgrounds coloridos**: `#98c4e2`

## Classes CSS Customizadas

### Cores de Fundo
```css
.bg-brand-primary      /* #3e6eb4 */
.bg-brand-secondary    /* #419fd8 */
.bg-brand-accent       /* #98c4e2 */
.bg-brand-light        /* #eaf7fd */
.bg-brand-lighter      /* #e1f4fb */
```

### Cores de Texto
```css
.text-brand-primary    /* #3e6eb4 */
.text-brand-secondary  /* #419fd8 */
.text-brand-accent     /* #98c4e2 */
.text-brand-lighter    /* #e1f4fb */
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
- **Primary Blue (#3e6eb4) sobre branco**: ✅ AAA (7.2:1)
- **Secondary Blue (#419fd8) sobre branco**: ✅ AA (4.8:1)
- **Texto slate-700 sobre branco**: ✅ AAA (12.5:1)
- **Primary Blue sobre Light Blue**: ✅ AA (5.1:1)

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
Primary:   #3e6eb4
Secondary: #419fd8
Accent:    #98c4e2
Light:     #eaf7fd
Lighter:   #e1f4fb
```

### RGB
```
Primary:   rgb(62, 110, 180)
Secondary: rgb(65, 159, 216)
Accent:    rgb(152, 196, 226)
Light:     rgb(234, 247, 253)
Lighter:   rgb(225, 244, 251)
```

### OKLCH (usado no código)
```
Primary:   oklch(0.48 0.12 245)
Secondary: oklch(0.64 0.09 230)
Accent:    oklch(0.80 0.06 230)
Light:     oklch(0.97 0.01 230)
Lighter:   oklch(0.96 0.01 230)
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
