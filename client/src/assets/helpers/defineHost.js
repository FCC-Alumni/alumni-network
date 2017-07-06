const DEV_HOST = '//localhost:8080';
const PROD_HOST = '//www.fcc-alumni.com';
const APP_HOST = process.env.NODE_ENV === 'production' ? PROD_HOST : DEV_HOST;

export default APP_HOST;
