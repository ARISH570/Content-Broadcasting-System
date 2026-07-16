const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();

const dbMode = (process.env.DB_MODE || "auto").toLowerCase();

const railwayPublicUrl = process.env.MYSQL_PUBLIC_URL;
const railwayPrivateUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

const databaseUrl =
  dbMode === "railway"
    ? railwayPublicUrl || railwayPrivateUrl
    : railwayPrivateUrl || railwayPublicUrl;

const localConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
};

const railwayConfig = {
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  username: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
};

// Common options for cloud databases (TiDB/Railway)
const cloudOptions = {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync("/etc/ssl/cert.pem"),
      rejectUnauthorized: true,
    },
  },
};

const localOptions = {
  dialect: "mysql",
  logging: false,
};

let sequelize;

if (dbMode === "railway") {
  sequelize = databaseUrl
    ? new Sequelize(databaseUrl, cloudOptions)
    : new Sequelize(
      railwayConfig.database,
      railwayConfig.username,
      railwayConfig.password,
      {
        host: railwayConfig.host,
        port: railwayConfig.port,
        ...cloudOptions,
      }
    );
} else if (dbMode === "local") {
  sequelize = new Sequelize(
    localConfig.database,
    localConfig.username,
    localConfig.password,
    {
      host: localConfig.host,
      port: localConfig.port,
      ...localOptions,
    }
  );
} else {
  sequelize = databaseUrl
    ? new Sequelize(databaseUrl, cloudOptions)
    : new Sequelize(
      railwayConfig.database,
      railwayConfig.username,
      railwayConfig.password,
      {
        host: railwayConfig.host,
        port: railwayConfig.port,
        ...cloudOptions,
      }
    );
}

module.exports = sequelize;