"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Truck, MapPin, User } from "lucide-react"
import { formatPrice } from "@/data/products"
import { useCart } from "@/hooks/use-cart"

interface CheckoutFormProps {
  onSubmit: (formData: any) => void
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const { cart, total } = useCart()
  const [formData, setFormData] = useState({
    // Información personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Dirección de envío
    address: "",
    city: "",
    department: "",
    postalCode: "",
    // Método de pago
    paymentMethod: "credit-card",
    // Notas adicionales
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const shippingCost = total >= 500000 ? 0 : 25000
  const finalTotal = total + shippingCost

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido"
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!formData.address.trim()) newErrors.address = "La dirección es requerida"
    if (!formData.city.trim()) newErrors.city = "La ciudad es requerida"
    if (!formData.department.trim()) newErrors.department = "El departamento es requerido"

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }

    // Validar teléfono (formato colombiano básico)
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        ...formData,
        cart,
        total: finalTotal,
        shippingCost,
        orderDate: new Date().toISOString(),
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Personal */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Información Personal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+57 300 123 4567"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dirección de Envío */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Dirección de Envío</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Dirección completa *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Calle 123 #45-67, Apartamento 101"
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Ciudad *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="department">Departamento *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange("department", e.target.value)}
                className={errors.department ? "border-destructive" : ""}
              />
              {errors.department && <p className="text-sm text-destructive mt-1">{errors.department}</p>}
            </div>
            <div>
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Método de Pago */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Método de Pago</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => handleInputChange("paymentMethod", value)}
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="credit-card" id="credit-card" />
              <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Tarjeta de Crédito/Débito</div>
                    <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                  </div>
                  <Badge variant="secondary">Recomendado</Badge>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="bank-transfer" id="bank-transfer" />
              <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Transferencia Bancaria</div>
                  <div className="text-sm text-muted-foreground">PSE - Débito desde tu cuenta bancaria</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
              <Label htmlFor="cash-on-delivery" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Pago Contraentrega</div>
                  <div className="text-sm text-muted-foreground">Paga en efectivo al recibir tu pedido</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notas Adicionales */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Notas Adicionales (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Instrucciones especiales de entrega, referencias del domicilio, etc."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Resumen Final */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} productos)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center space-x-1">
                <Truck className="h-4 w-4" />
                <span>Envío</span>
              </span>
              <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                {shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total a Pagar</span>
            <span className="text-primary">{formatPrice(finalTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Envío */}
      <Button type="submit" size="lg" className="w-full btn-primary">
        Confirmar Pedido
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al confirmar tu pedido, aceptas nuestros términos y condiciones de venta.
      </p>
    </form>
  )
}
