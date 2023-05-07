export const capitalize = (str: string): string => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const isDate = (date: string): boolean => {
  return !isNaN(Date.parse(date))
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
