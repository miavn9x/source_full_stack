// PM2 config — Plasmic Studio (WAB) native trên Windows/Linux
// Chạy: pm2 start ecosystem.config.cjs
// Yêu cầu: đã clone repo + yarn install + yarn build tại PLASMIC_WAB_DIR

const WAB_DIR = process.env.PLASMIC_WAB_DIR || "C:\\plasmic\\platform\\wab";

module.exports = {
  apps: [
    {
      name: "plasmic-studio",
      cwd: WAB_DIR,
      interpreter: "node",
      script: "yarn",
      args: "run start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "4G",
      out_file: "./logs/plasmic-out.log",
      error_file: "./logs/plasmic-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: "3003",
        DATABASE_URL: "postgresql://plasmic:112233@127.0.0.1:5432/plasmic",
        WAB_DBNAME: "plasmic",
        WAB_DBPASSWORD: "112233",
      },
      restart_delay: 5000,
      min_uptime: "10s",
      max_restarts: 10,
    },
  ],
};
