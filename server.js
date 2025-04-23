const { shopifyApi, LATEST_API_VERSION, MemorySessionStorage } = require("@shopify/shopify-api");
const express = require("express");
const session = require("express-session");
const { shopifyApi, LATEST_API_VERSION } = require("@shopify/shopify-api");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SHOPIFY_API_SECRET,
  resave: false,
  saveUninitialized: false
}));

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES.split(","),
  hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ""),
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  const { shopifyApi, LATEST_API_VERSION, MemorySessionStorage } = require("@shopify/shopify-api");

// ... later inside shopifyApi config
sessionStorage: new MemorySessionStorage(),
});

app.get("/auth", async (req, res) => {
  await shopify.auth.begin({
    shop: req.query.shop,
    callbackPath: "/auth/callback",
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });
});

app.get("/auth/callback", async (req, res) => {
  try {
    await shopify.auth.validateAuthCallback(req, res, req.query);
    res.redirect(`/?shop=${req.query.shop}`);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});
