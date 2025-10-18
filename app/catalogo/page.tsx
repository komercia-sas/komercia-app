"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Badge } from "@/components/ui/badge"
import { filterProducts } from "@/data/products"
import { useSearchParams } from "next/navigation"

export default function CatalogoPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todas")
  const [filteredProducts, setFilteredProducts] = useState(filterProducts())

  // Initialize filters from URL params
  useEffect(() => {
    const categoria = searchParams.get("categoria")
    const busqueda = searchParams.get("busqueda")

    if (categoria) {
      setSelectedCategory(categoria)
    }
    if (busqueda) {
      setSearchTerm(busqueda)
    }
  }, [searchParams])

  // Update filtered products when filters change
  useEffect(() => {
    const filtered = filterProducts(searchTerm, selectedCategory)
    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory])

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Catálogo
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-balance">Encuentra la silla perfecta para ti</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Explora nuestra amplia selección de sillas de oficina diseñadas para brindarte máxima comodidad y estilo
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          productCount={filteredProducts.length}
        />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🪑</div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground mb-6">Intenta ajustar tus filtros o términos de búsqueda</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("todas")
              }}
              className="text-primary hover:underline"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
