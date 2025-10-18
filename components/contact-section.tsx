import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { companyInfo } from "@/data/company"

export function ContactSection() {
  return (
    <section id="contacto" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Contáctanos
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-balance">¿Dónde estamos?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Visítanos en nuestra sede principal o contáctanos para recibir asesoría personalizada
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Ubicación</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{companyInfo.contact.address}</p>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Mapa interactivo</p>
                    <p className="text-xs text-muted-foreground">Av. Empresarial #123, Bogotá</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Teléfono</span>
                  </div>
                  <p className="text-muted-foreground">{companyInfo.contact.phone}</p>
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Email</span>
                  </div>
                  <p className="text-muted-foreground">{companyInfo.contact.email}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="card-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Horarios de Atención</span>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{companyInfo.contact.hours}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Nuestros Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {companyInfo.services.map((service, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button className="w-full btn-primary" size="lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar por WhatsApp
              </Button>

              <Button variant="outline" className="w-full bg-transparent" size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email
              </Button>
            </div>

            <Card className="bg-primary text-primary-foreground card-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">¿Necesitas asesoría?</h3>
                <p className="text-sm opacity-90 mb-4">
                  Nuestros expertos te ayudan a encontrar la silla perfecta para tu espacio
                </p>
                <Button variant="secondary" size="sm">
                  Agendar Cita
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
