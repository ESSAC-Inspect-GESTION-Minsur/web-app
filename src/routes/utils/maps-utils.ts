export const goToGoogleMapsPage = (locationString: string): void => {
  const location = locationString.split(',')
  const [latitude, longitude] = [location[0], location[1]]

  const link = `http://maps.google.com/maps?z=12&t=m&q=loc:${latitude}+${longitude}`

  window.open(link, '_blank', 'noopener,noreferrer')
}
