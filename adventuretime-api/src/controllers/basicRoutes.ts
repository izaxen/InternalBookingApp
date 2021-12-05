import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", async (_: Request, res: Response) => {
  res.status(200).json({
    message: "Nice, you manage to send a GET request",
  });
});

router.get("/:slug", async (req: Request, res: Response) => {
  const data = req.params.slug;

  res.status(200).json({
    message: "Nice, you manage to send a GET request with a slug",
    slug: data,
  });
});

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;

  res.status(200).json({
    message: "Nice, you manage to send a POST request",
    payload: data,
  });
});

router.put("/", async (req: Request, res: Response) => {
  const data = req.body;

  res.status(200).json({
    message: "Nice, you manage to send a PUT request",
    payload: data,
  });
});

router.delete("/", async (_: Request, res: Response) => {
  res.status(200).json({
    message: "Nice, you manage to send a DELETE request",
  });
});

router.patch("/", async (req: Request, res: Response) => {
  const data = req.body;

  res.status(200).json({
    message: "Nice, you manage to send a PATCH request",
    payload: data,
  });
});

export = router;