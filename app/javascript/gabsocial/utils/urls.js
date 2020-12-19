import punycode from 'punycode'
const IDNA_PREFIX = 'xn--'

export const decodeIDNA = (domain) => {
  return domain
    .split('.')
    .map(part => part.indexOf(IDNA_PREFIX) === 0 ? punycode.decode(part.slice(IDNA_PREFIX.length)) : part)
    .join('.')
}

export const getHostname = (url) => {
  const parser = document.createElement('a')
  parser.href = url
  return parser.hostname
}

export const trim = (text, len) => {
  const cut = text.indexOf(' ', len)

  if (cut === -1) {
    return text
  }

  return text.substring(0, cut) + (text.length > len ? '…' : '')
}