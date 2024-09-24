import fs from "fs";

export const CONTENTS_DIR =
  process.env.NODE_ENV === "development" ? "./contents" : "/contents";

if (!fs.existsSync(CONTENTS_DIR)) fs.mkdirSync(CONTENTS_DIR);
if (!fs.existsSync(CONTENTS_DIR + "/image"))
  fs.mkdirSync(CONTENTS_DIR + "/image");
if (!fs.existsSync(CONTENTS_DIR + "/image/icon"))
  fs.mkdirSync(CONTENTS_DIR + "/image/icon");
if (!fs.existsSync(CONTENTS_DIR + "/image/thumbnail"))
  fs.mkdirSync(CONTENTS_DIR + "/image/thumbnail");
if (!fs.existsSync(CONTENTS_DIR + "/video"))
  fs.mkdirSync(CONTENTS_DIR + "/video");
