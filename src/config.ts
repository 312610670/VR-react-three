let domain = process.env.REACT_APP_DOMAIN || 'mycaigou.com';

if (process.env.NODE_ENV === 'production') {
  const host = window.location.host;
  domain = host.substring(host.indexOf('.') + 1);
}

function getPath(subDomain = 'm', path = '') {
  return `https://${subDomain}.${domain}${path}`;
}

export default {
  getPath,
};
