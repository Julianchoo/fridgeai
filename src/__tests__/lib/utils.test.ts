import { cn } from '@/lib/utils'

describe('cn function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
  })

  it('should merge conflicting Tailwind classes correctly', () => {
    // twMerge should prioritize the last conflicting class
    expect(cn('px-4', 'px-8')).toBe('px-8')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle arrays of classes', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
  })

  it('should handle objects with boolean values', () => {
    expect(cn({
      'always': true,
      'never': false,
      'conditional': true
    })).toBe('always conditional')
  })

  it('should handle undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined, false)).toBe('')
  })

  it('should handle complex Tailwind class merging scenarios', () => {
    expect(cn(
      'h-10 w-10',
      'h-8', // should override h-10
      'w-12'  // should override w-10
    )).toBe('h-8 w-12')
  })

  it('should preserve non-conflicting classes', () => {
    expect(cn('flex items-center justify-center', 'p-4 bg-blue-500'))
      .toBe('flex items-center justify-center p-4 bg-blue-500')
  })

  it('should handle modifier classes correctly', () => {
    expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500')
    expect(cn('md:flex', 'lg:flex')).toBe('md:flex lg:flex')
  })
})