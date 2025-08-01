import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(422).json({
      type: "validation",
      errors: err.flatten().fieldErrors,
      message: "Validation failed",
    });
  }

  if (err.status && err.message) {
    return res.status(err.status).json({
      type: "custom",
      message: err.message,
    });
  }

  return res.status(500).json({
    type: "server",
    message: "Something went wrong",
  });
};
