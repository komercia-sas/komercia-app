// Función propia para combinar clases CSS
export function cn(
  ...inputs: (string | undefined | null | false)[]
) {
  return inputs.filter(Boolean).join(' ').trim();
}
