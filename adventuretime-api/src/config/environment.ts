

import Dotenv from "dotenv";

Dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const context = {
  projectId: process.env.GCLOUD_PROJECT,
  port: process.env.PORT,
};

export default context;