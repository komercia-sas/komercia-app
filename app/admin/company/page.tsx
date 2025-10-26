'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Save, Building2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/use-company';
import { CompanyInfo } from '@/lib/vercel-blob';

export default function AdminCompany() {
  const { companyInfo: globalCompanyInfo, refetch } = useCompany();
  const [localCompanyInfo, setLocalCompanyInfo] = useState<CompanyInfo | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (globalCompanyInfo) {
      setLocalCompanyInfo(globalCompanyInfo);
    }
  }, [globalCompanyInfo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localCompanyInfo),
      });

      if (response.ok) {
        setMessage('Información actualizada correctamente');
        // Actualizar el contexto global después de guardar exitosamente
        await refetch();
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Error al actualizar la información');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Logout exitoso, redirigir al login
        router.push('/admin/login');
      } else {
        console.error('Error al cerrar sesión');
        // Aún así redirigir al login
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      // Aún así redirigir al login
      router.push('/admin/login');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setLocalCompanyInfo(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any
  ) => {
    setLocalCompanyInfo(prev =>
      prev
        ? {
            ...prev,
            [parent]: {
              ...(prev[parent as keyof CompanyInfo] as Record<string, any>),
              [field]: value,
            },
          }
        : null
    );
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split('\n').filter(item => item.trim());
    setLocalCompanyInfo(prev => (prev ? { ...prev, [field]: array } : null));
  };

  if (!globalCompanyInfo || !localCompanyInfo) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Button
              variant='ghost'
              onClick={() => router.push('/admin/dashboard')}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver
            </Button>
            <div className='ml-4'>
              <h1 className='text-xl font-semibold text-gray-900 flex items-center'>
                <Building2 className='h-6 w-6 mr-2 text-blue-600' />
                Información de la Empresa
              </h1>
            </div>

            <Button variant='outline' onClick={handleLogout}>
              <LogOut className='h-4 w-4 mr-2' />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        <form onSubmit={handleSave} className='space-y-6'>
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Información principal que aparece en la página de inicio
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='name'>Nombre de la Empresa</Label>
                <Input
                  id='name'
                  value={localCompanyInfo.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder='Ej: Komercia SAS'
                />
              </div>

              <div>
                <Label htmlFor='tagline'>Tagline</Label>
                <Input
                  id='tagline'
                  value={localCompanyInfo.tagline}
                  onChange={e => handleInputChange('tagline', e.target.value)}
                  placeholder='Ej: Comodidad y elegancia para tu espacio de trabajo'
                />
              </div>

              <div>
                <Label htmlFor='description'>Descripción</Label>
                <Textarea
                  id='description'
                  value={localCompanyInfo.description}
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Descripción detallada de la empresa...'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>Acerca de Nosotros</CardTitle>
              <CardDescription>
                Historia, visión y valores de la empresa
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='history'>Historia</Label>
                <Textarea
                  id='history'
                  value={localCompanyInfo.about.history}
                  onChange={e =>
                    handleNestedInputChange('about', 'history', e.target.value)
                  }
                  placeholder='Cuenta la historia de tu empresa...'
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor='vision'>Visión</Label>
                <Textarea
                  id='vision'
                  value={localCompanyInfo.about.vision}
                  onChange={e =>
                    handleNestedInputChange('about', 'vision', e.target.value)
                  }
                  placeholder='¿Cuál es la visión de tu empresa?'
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor='values'>Valores (uno por línea)</Label>
                <Textarea
                  id='values'
                  value={localCompanyInfo.about.values.join('\n')}
                  onChange={e =>
                    handleNestedInputChange(
                      'about',
                      'values',
                      e.target.value.split('\n').filter(v => v.trim())
                    )
                  }
                  placeholder='Calidad: Productos que superan las expectativas&#10;Innovación: Siempre a la vanguardia del diseño'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>
                Datos de contacto que aparecen en la página
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='address'>Dirección</Label>
                  <Input
                    id='address'
                    value={localCompanyInfo.contact.address}
                    onChange={e =>
                      handleNestedInputChange(
                        'contact',
                        'address',
                        e.target.value
                      )
                    }
                    placeholder='Av. Empresarial #123, Bogotá, Colombia'
                  />
                </div>

                <div>
                  <Label htmlFor='phone'>Teléfono</Label>
                  <Input
                    id='phone'
                    value={localCompanyInfo.contact.phone}
                    onChange={e =>
                      handleNestedInputChange(
                        'contact',
                        'phone',
                        e.target.value
                      )
                    }
                    placeholder='+57 (1) 234-5678'
                  />
                </div>

                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={localCompanyInfo.contact.email}
                    onChange={e =>
                      handleNestedInputChange(
                        'contact',
                        'email',
                        e.target.value
                      )
                    }
                    placeholder='info@sillasoffice.com'
                  />
                </div>

                <div>
                  <Label htmlFor='whatsapp'>WhatsApp</Label>
                  <Input
                    id='whatsapp'
                    value={localCompanyInfo.contact.whatsapp}
                    onChange={e =>
                      handleNestedInputChange(
                        'contact',
                        'whatsapp',
                        e.target.value
                      )
                    }
                    placeholder='+57 300 123 4567'
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='hours'>Horarios de Atención</Label>
                <Textarea
                  id='hours'
                  value={localCompanyInfo.contact.hours}
                  onChange={e =>
                    handleNestedInputChange('contact', 'hours', e.target.value)
                  }
                  placeholder='Lunes a Viernes: 8:00 AM - 6:00 PM&#10;Sábados: 9:00 AM - 4:00 PM'
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>
                Enlaces a las redes sociales de la empresa
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='facebook'>Facebook</Label>
                  <Input
                    id='facebook'
                    value={localCompanyInfo.social.facebook}
                    onChange={e =>
                      handleNestedInputChange(
                        'social',
                        'facebook',
                        e.target.value
                      )
                    }
                    placeholder='https://facebook.com/sillasoffice'
                  />
                </div>

                <div>
                  <Label htmlFor='instagram'>Instagram</Label>
                  <Input
                    id='instagram'
                    value={localCompanyInfo.social.instagram}
                    onChange={e =>
                      handleNestedInputChange(
                        'social',
                        'instagram',
                        e.target.value
                      )
                    }
                    placeholder='https://instagram.com/sillasoffice'
                  />
                </div>

                <div>
                  <Label htmlFor='linkedin'>LinkedIn</Label>
                  <Input
                    id='linkedin'
                    value={localCompanyInfo.social.linkedin}
                    onChange={e =>
                      handleNestedInputChange(
                        'social',
                        'linkedin',
                        e.target.value
                      )
                    }
                    placeholder='https://linkedin.com/company/sillasoffice'
                  />
                </div>

                <div>
                  <Label htmlFor='youtube'>YouTube</Label>
                  <Input
                    id='youtube'
                    value={localCompanyInfo.social.youtube}
                    onChange={e =>
                      handleNestedInputChange(
                        'social',
                        'youtube',
                        e.target.value
                      )
                    }
                    placeholder='https://youtube.com/sillasoffice'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
              <CardDescription>
                Lista de servicios que ofrece la empresa (uno por línea)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor='services'>Servicios</Label>
                <Textarea
                  id='services'
                  value={localCompanyInfo.services.join('\n')}
                  onChange={e => handleArrayChange('services', e.target.value)}
                  placeholder='Asesoría ergonómica personalizada&#10;Entrega gratuita en Bogotá&#10;Instalación y montaje'
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className='flex justify-end space-x-4'>
            {message && (
              <div
                className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}
              >
                {message}
              </div>
            )}
            <Button type='submit' disabled={saving}>
              <Save className='h-4 w-4 mr-2' />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
