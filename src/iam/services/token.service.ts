// TODO: SET THIS TO REDUX STORAGE

const TOKEN_KEY = 'TOKEN'
const EXPIRE_DAYS = 1

const setCookie = (name: string, value: string, days: number): void => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/;'
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const getToken = (): string | null => {
  return getCookie(TOKEN_KEY)
}

const saveToken = (_token: string): void => {
  setCookie(TOKEN_KEY, _token, EXPIRE_DAYS)
}

const removeToken = (): void => {
  document.cookie = TOKEN_KEY + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export const TokenService = {
  getToken,
  saveToken,
  removeToken
}
