import { render, screen, fireEvent } from '@testing-library/react'
import { Button, buttonVariants } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('should render different variants correctly', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
    
    variants.forEach((variant) => {
      render(<Button variant={variant} data-testid={`button-${variant}`}>Test</Button>)
      const button = screen.getByTestId(`button-${variant}`)
      expect(button).toBeInTheDocument()
    })
  })

  it('should render different sizes correctly', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const
    
    sizes.forEach((size) => {
      render(<Button size={size} data-testid={`button-${size}`}>Test</Button>)
      const button = screen.getByTestId(`button-${size}`)
      expect(button).toBeInTheDocument()
    })
  })

  it('should handle disabled state', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    
    const button = screen.getByRole('button', { name: 'Clickable' })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('should merge custom className with default classes', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Custom Button' })
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('inline-flex') // default class should still be there
  })

  it('should apply focus styles', () => {
    render(<Button>Focus Test</Button>)
    
    const button = screen.getByRole('button', { name: 'Focus Test' })
    expect(button).toHaveClass('focus-visible:border-ring', 'focus-visible:ring-ring/50')
  })

  it('should handle destructive variant with specific styles', () => {
    render(<Button variant="destructive">Delete</Button>)
    
    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveClass('bg-destructive', 'text-white')
  })

  it('should handle outline variant', () => {
    render(<Button variant="outline">Outlined</Button>)
    
    const button = screen.getByRole('button', { name: 'Outlined' })
    expect(button).toHaveClass('border', 'bg-background')
  })

  it('should handle ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    
    const button = screen.getByRole('button', { name: 'Ghost' })
    expect(button).toHaveClass('hover:bg-accent')
  })

  it('should handle link variant', () => {
    render(<Button variant="link">Link Style</Button>)
    
    const button = screen.getByRole('button', { name: 'Link Style' })
    expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline')
  })

  it('should handle icon size properly', () => {
    render(<Button size="icon" aria-label="Icon button">🚀</Button>)
    
    const button = screen.getByRole('button', { name: 'Icon button' })
    expect(button).toHaveClass('size-9')
  })

  it('should pass through other HTML button props', () => {
    render(
      <Button 
        type="submit" 
        form="test-form" 
        data-testid="submit-button"
      >
        Submit
      </Button>
    )
    
    const button = screen.getByTestId('submit-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('form', 'test-form')
  })
})

describe('buttonVariants', () => {
  it('should generate correct classes for default variant and size', () => {
    const classes = buttonVariants()
    expect(classes).toContain('bg-primary')
    expect(classes).toContain('text-primary-foreground')
    expect(classes).toContain('h-9')
  })

  it('should generate correct classes for specific variant and size', () => {
    const classes = buttonVariants({
      variant: 'destructive',
      size: 'lg'
    })
    expect(classes).toContain('bg-destructive')
    expect(classes).toContain('h-10')
  })

  it('should handle custom className', () => {
    const classes = buttonVariants({
      className: 'my-custom-class'
    })
    expect(classes).toContain('my-custom-class')
  })
})