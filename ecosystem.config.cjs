module.exports = {
  apps: [
    {
      name: "portfolio",
      cwd: "/var/www/portfolio",
      script: "pnpm",
      args: "start",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};