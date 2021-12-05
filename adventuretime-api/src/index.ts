import app from "./app";
import logger from "./logger";
import environment from "./config/environment";

// Run server
import { Request, Response } from "express";
import express = require('express');

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!')
})

app.listen(environment.port, () => {
  logger.info(`App running on port ${environment.port}`);
})

