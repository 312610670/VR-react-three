let domain = process.env.REACT_APP_DOMAIN || 'baidu.com';

if (process.env.NODE_ENV === 'production') {
  const host = window.location.host
  domain = host.substring(host.indexOf('.') + 1 )
}
function getPath (subDomain = 'ooo', path = '') {
  return `https://${subDomain}.${domain}${path}`;
}

export default {
  getPath
}