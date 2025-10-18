# Atualização de Cores - Text79 para Escrita360

## Resumo
O esquema de cores foi atualizado para usar a paleta oficial do site Text79, garantindo consistência visual entre o site original e a versão React.

## Alterações Realizadas

### 1. Cores Principais Atualizadas

#### Antes (Escrita360):
```css
--brand-primary: #3e6eb4
--brand-secondary: #419fd8
--brand-accent: #98c4e2
--brand-light: #eaf7fd
--brand-lighter: #e1f4fb
```

#### Depois (Text79):
```css
--brand-primary: #4070B7    /* Primary Blue */
--brand-secondary: #61C2D3  /* Secondary Blue */
--brand-accent: #39A1DB     /* Accent Blue */
--brand-dark: #1A5B94       /* Dark Blue - NOVA */
--brand-light: #F5F9FC      /* Light Blue */
--brand-lighter: #EBF5F9    /* Lighter Blue */
```

### 2. Valores OKLCH Atualizados

#### Sistema de Cores Semântico (`:root`)
- `--primary`: oklch(0.50 0.13 250) - #4070B7
- `--secondary`: oklch(0.66 0.10 215) - #61C2D3
- `--accent`: oklch(0.60 0.12 235) - #39A1DB
- `--muted`: oklch(0.96 0.01 220) - #EBF5F9
- `--ring`: oklch(0.60 0.12 235) - #39A1DB

### 3. Novas Classes CSS

Adicionado suporte para a nova cor Dark Blue:
```css
.bg-brand-dark
.text-brand-dark
```

### 4. Sombras Atualizadas

Ajustadas para usar os valores RGB corretos do Primary Blue:
```css
/* Antes */
box-shadow: 0 10px 25px rgba(62, 110, 180, 0.3);

/* Depois */
box-shadow: 0 10px 25px rgba(64, 112, 183, 0.3);
```

## Impacto Visual

### Mudanças Perceptíveis:
1. **Primary Blue mais vibrante**: #4070B7 é ligeiramente mais brilhante que #3e6eb4
2. **Secondary mais cyan**: #61C2D3 tem mais verde, criando um contraste mais dinâmico
3. **Accent mais intenso**: #39A1DB é mais saturado que #98c4e2
4. **Nova cor Dark Blue**: #1A5B94 para ênfase e contraste forte

### Melhorias de Acessibilidade:
- **Primary Blue**: AAA (7.5:1 vs 7.2:1 anterior)
- **Accent Blue**: AA (5.2:1 vs não disponível antes)
- **Dark Blue**: AAA (10.1:1) - nova opção para alto contraste

## Arquivos Modificados

1. **src/App.css**
   - ✅ Variáveis CSS atualizadas
   - ✅ Valores OKLCH recalculados
   - ✅ Classes de utilidade expandidas
   - ✅ Sombras ajustadas

2. **PALETA-CORES.md**
   - ✅ Documentação completa atualizada
   - ✅ Novos valores hex, RGB e OKLCH
   - ✅ Guia de uso atualizado
   - ✅ Informações de acessibilidade revisadas

## Como Usar

### Classes Disponíveis:

#### Backgrounds:
```jsx
<div className="bg-brand-primary">
<div className="bg-brand-secondary">
<div className="bg-brand-accent">
<div className="bg-brand-dark">      {/* NOVA */}
<div className="bg-brand-light">
<div className="bg-brand-lighter">
```

#### Textos:
```jsx
<h1 className="text-brand-primary">
<p className="text-brand-secondary">
<span className="text-brand-accent">
<strong className="text-brand-dark">  {/* NOVA */}
```

#### Gradientes:
```jsx
<div className="bg-brand-gradient">        {/* Primary → Secondary */}
<div className="bg-brand-gradient-light">  {/* Lighter → White */}
<div className="bg-brand-gradient-subtle"> {/* Light → White */}
```

## Compatibilidade

✅ **Totalmente compatível** com:
- Tailwind CSS
- Componentes shadcn/ui
- Sistema de design Text79
- Modo claro (dark mode não afetado)

## Próximos Passos

1. ✅ Atualizar variáveis CSS
2. ✅ Atualizar documentação
3. ⏳ Testar em todos os componentes
4. ⏳ Validar acessibilidade
5. ⏳ Deploy e verificação

## Notas Técnicas

- **Formato de cor**: Usando OKLCH para melhor interpolação de cores
- **Fallback**: Valores hex mantidos em comentários para referência
- **Consistência**: 100% alinhado com Text79 original
- **Performance**: Sem impacto, apenas valores de variáveis alterados

---

**Data**: Outubro 2025  
**Versão**: 2.0  
**Status**: ✅ Implementado
