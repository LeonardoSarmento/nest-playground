export default () => ({
  node_env: process.env.NODE_ENV || 'development',

  app_port: parseInt(process.env.APP_PORT || '3000', 10),
  /** OBS: Não usar ultima barra */
  app_upload_path: process.env.UPLOAD_PATH || './upload',
  app_frontend_url: process.env.APP_FRONTEND_URL || 'http://localhost:3333',
  app_basename: process.env.APP_BASENAME || '',
  jwt_secret:
    process.env.JWT_SHA256 ||
    '412ba163c5b3db42dfc0310570fa269c594efdef192ed8d30a46b0b764c1ed79',

  database: {
    drive: process.env.DATABASE_DRIVE || 'sqlite',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASS,
  },
});
