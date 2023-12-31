let watch = false;
let instances = 1;
let exec_mode = "fork";

module.exports = {
  apps: [
    {
      name: "Backend Service",
      cwd: "/home/AudioCentre-Backend",
      script: "npm start",
      exp_backoff_restart_delay: 100,
      instances,
      exec_mode,
      watch,
      max_memory_restart: "1G",
      autorestart: true,
      env: {
        PORT: 3000,
        MONGO_URL:
          "mongodb+srv://AUDIOCENTRE:ENoNDR9rhgkvCosI@dbprod.uykdgyl.mongodb.net/?retryWrites=true&w=majority",
        EMAIL: "nwahidm@gmail.com",
        PASSWORD: "ocwj hals hvyb kfsm",
        SECRET: "TESTING",
      },
    },
  ],
};
