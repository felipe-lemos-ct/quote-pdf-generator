const express = require("express");
const pdfService = require("../service/pdf-service");

const router = express.Router();
router.get("/quote", (req, res, next) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment;filename=quote.pdf",
  });

  pdfService.buildPDF(
    (chunk) => stream.write(chunk),
    () => stream.end()
  );
});

module.exports = router;
