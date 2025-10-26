import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, Eye, Heart } from 'lucide-react';
import { useCompany } from '@/hooks/use-company';

export function AboutSection() {
  const { companyInfo, loading } = useCompany();

  if (loading || !companyInfo) {
    return null;
  }
  const features = [
    {
      icon: CheckCircle,
      title: 'Calidad Garantizada',
      description: 'Productos certificados con garantía extendida',
    },
    {
      icon: Target,
      title: 'Diseño Ergonómico',
      description: 'Sillas diseñadas para tu bienestar y productividad',
    },
    {
      icon: Eye,
      title: 'Estilo Profesional',
      description: 'Elegancia que complementa cualquier oficina',
    },
    {
      icon: Heart,
      title: 'Servicio Personalizado',
      description: 'Asesoría especializada para cada cliente',
    },
  ];

  return (
    <section id='nosotros' className='py-24 bg-muted/30'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <Badge variant='secondary' className='mb-4'>
            Quiénes Somos
          </Badge>
          <h2 className='text-3xl lg:text-4xl font-bold mb-6 text-balance'>
            Líderes en soluciones ergonómicas para oficina
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto text-pretty'>
            {companyInfo.about.history}
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-16 items-center mb-16'>
          <div className='space-y-8'>
            <div>
              <h3 className='text-2xl font-bold mb-4'>Nuestra Historia</h3>
              <p className='text-muted-foreground leading-relaxed'>
                {companyInfo.about.history}
              </p>
            </div>

            <div>
              <h3 className='text-2xl font-bold mb-4'>Nuestra Visión</h3>
              <p className='text-muted-foreground leading-relaxed'>
                {companyInfo.about.vision}
              </p>
            </div>

            <div>
              <h3 className='text-2xl font-bold mb-4'>Nuestros Valores</h3>
              <ul className='space-y-3'>
                {companyInfo.about.values.map((value, index) => (
                  <li key={index} className='flex items-start space-x-3'>
                    <CheckCircle className='h-5 w-5 text-primary mt-0.5 flex-shrink-0' />
                    <span className='text-muted-foreground'>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='relative'>
            <img
              src='https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=500&fit=crop'
              alt='Oficina moderna'
              className='w-full h-[500px] object-cover rounded-2xl card-shadow'
            />
          </div>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map((feature, index) => (
            <Card
              key={index}
              className='card-shadow hover:shadow-lg transition-shadow'
            >
              <CardContent className='p-6 text-center'>
                <feature.icon className='h-12 w-12 text-primary mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                <p className='text-sm text-muted-foreground'>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
