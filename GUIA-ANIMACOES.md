# 🎨 Guia Rápido - Como Usar as Animações

## Para Desenvolvedores

### 1. Adicionar Animação de Scroll a Qualquer Elemento

```jsx
import { useScrollAnimation } from '@/hooks/use-scroll-animation.js'

function MeuComponente() {
  const elementRef = useScrollAnimation()
  
  return (
    <section ref={elementRef} className="animate-on-scroll">
      <div className="animate-fade-in-up">
        Conteúdo que aparece ao scroll
      </div>
    </section>
  )
}
```

### 2. Animações Disponíveis

#### Entrada
```jsx
<div className="animate-fade-in-up">Sobe com fade</div>
<div className="animate-fade-in-down">Desce com fade</div>
<div className="animate-fade-in-left">Vem da esquerda</div>
<div className="animate-fade-in-right">Vem da direita</div>
<div className="animate-scale-in">Escala com fade</div>
<div className="animate-rotate-in">Rotação com entrada</div>
```

#### Contínuas
```jsx
<Icon className="animate-float" /> {/* Flutuação suave */}
<Icon className="animate-pulse-glow" /> {/* Pulso luminoso */}
```

#### Delays
```jsx
<div className="animate-fade-in-up delay-200">Atraso 200ms</div>
<div className="animate-fade-in-up delay-400">Atraso 400ms</div>
<div className="animate-fade-in-up delay-600">Atraso 600ms</div>
```

### 3. Hover Effects

```jsx
{/* Lift com sombra */}
<Card className="hover-lift">
  Conteúdo
</Card>

{/* Logo animado */}
<img className="logo-animate" />

{/* Transição padrão em links */}
<a href="#" className="transition-all hover:scale-105">
  Link
</a>
```

### 4. Ícones Animados

```jsx
import { Edit, Brain, TrendingUp } from 'lucide-react'

<Edit className="animate-float" />
<Brain className="animate-float delay-300" />
<TrendingUp className="animate-pulse-glow" />
```

### 5. Cards com Animação

```jsx
<Card className="hover-lift animate-scale-in delay-200">
  <CardContent>
    <Icon className="animate-float" />
    <h3>Título</h3>
    <p>Descrição</p>
  </CardContent>
</Card>
```

### 6. Seções Completas

```jsx
function MinhaSecao() {
  const sectionRef = useScrollAnimation()
  
  return (
    <section ref={sectionRef} className="animate-on-scroll">
      <h2 className="animate-fade-in-up">Título</h2>
      <p className="animate-fade-in-up delay-200">Subtítulo</p>
      
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, i) => (
          <Card 
            key={i}
            className={`hover-lift animate-scale-in delay-${i * 100}`}
          >
            {item.content}
          </Card>
        ))}
      </div>
    </section>
  )
}
```

## 🎯 Padrões Recomendados

### Hero Section
```jsx
<section ref={heroRef} className="animate-on-scroll">
  <h1 className="animate-fade-in-up">Título Principal</h1>
  <p className="animate-fade-in-up delay-200">Subtítulo</p>
  <Button className="animate-fade-in-up delay-400 hover:scale-105">
    CTA
  </Button>
</section>
```

### Grid de Cards
```jsx
{items.map((item, index) => (
  <Card className={`hover-lift animate-scale-in delay-${Math.min(index * 100, 800)}`}>
    <Icon className="animate-float delay-${index * 100}" />
    {/* conteúdo */}
  </Card>
))}
```

### Tabs Animadas
```jsx
<button
  className={`transition-all duration-300 hover:scale-105 ${
    active ? 'scale-105 shadow-lg' : ''
  }`}
>
  Tab Label
</button>
```

### Formulários
```jsx
<form className="animate-fade-in-left">
  <Input className="transition-all focus:scale-105" />
  <Button className="hover:scale-110 hover:shadow-xl">
    Enviar
  </Button>
</form>
```

## ⚡ Performance Tips

1. **Use transform e opacity** (GPU-accelerated)
2. **Evite animar width/height** (causam reflow)
3. **Limite delays** (max 800ms)
4. **Use will-change** com cuidado
5. **Prefira CSS sobre JS** para animações simples

## 🎨 Customização

### Modificar Duração
```css
.animate-fade-in-up {
  animation-duration: 0.8s; /* padrão: 0.6s */
}
```

### Criar Nova Animação
```css
@keyframes minhaAnimacao {
  from { opacity: 0; transform: rotate(180deg); }
  to { opacity: 1; transform: rotate(0); }
}

.animate-minha {
  animation: minhaAnimacao 0.6s ease-out forwards;
}
```

### Ajustar Hook de Scroll
```jsx
const ref = useScrollAnimation({
  threshold: 0.2,        // 20% visível
  rootMargin: '50px',    // Trigger 50px antes
  triggerOnce: false     // Repetir ao scroll
})
```

## 🐛 Troubleshooting

### Animação não aparece?
1. Verifique se `useScrollAnimation` está sendo usado
2. Confirme classe `animate-on-scroll` no container
3. Check se elemento tem classe de animação

### Animação muito rápida/lenta?
```css
.animate-fade-in-up {
  animation-duration: 1s !important;
}
```

### Delay não funciona?
```jsx
{/* Correto */}
<div className="animate-fade-in-up delay-300">

{/* Incorreto */}
<div className="animate-fade-in-up" style={{delay: '300ms'}}>
```

## 📚 Exemplos Completos

### Seção de Estatísticas
```jsx
const statsRef = useScrollAnimation()

<section ref={statsRef} className="animate-on-scroll">
  {stats.map((stat, i) => (
    <Card className={`hover-lift animate-fade-in-up delay-${i * 100}`}>
      <Icon className="animate-pulse-glow" />
      <h3>{stat.number}</h3>
      <p>{stat.label}</p>
    </Card>
  ))}
</section>
```

### Hero Interativo
```jsx
<section className="hero animate-fade-in">
  <div className="animate-fade-in-left">
    <h1>Título</h1>
    <Button className="hover:scale-110">CTA</Button>
  </div>
  <div className="animate-fade-in-right delay-200">
    <Card className="hover-lift">
      <Edit className="animate-float" />
    </Card>
  </div>
</section>
```

---

**Documentação Completa**: `ANIMACOES-IMPLEMENTADAS.md`
**Servidor de Desenvolvimento**: `pnpm run dev`
