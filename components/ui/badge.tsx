import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

// Función para obtener las clases de variantes del Badge
function getBadgeVariants(variant: string = 'default', className?: string) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden'
  
  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
    secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
    destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20',
    outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
  }
  
  return cn(
    baseClasses,
    variantClasses[variant as keyof typeof variantClasses] || variantClasses.default,
    className
  )
}

interface BadgeProps extends React.ComponentProps<'span'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  asChild?: boolean
  className?: string
}

function Badge({ className, variant = 'default', asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={getBadgeVariants(variant, className)}
      {...props}
    />
  )
}

export { Badge }
