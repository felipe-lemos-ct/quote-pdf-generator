import express from "express";
import { buildPDF } from "../service/pdf-service.js";

const router = express.Router();

router.get("/quote", (req, res, next) => {
  const orderId = req.query.orderId;
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=quote.pdf",
  });

  buildPDF(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    orderId
  );
});

export default router;
