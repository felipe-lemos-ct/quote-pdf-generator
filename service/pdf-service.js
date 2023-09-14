import PDFDocument from "pdfkit";
import axios from "axios";
import { fetchCt } from "../commercetools/auth.js";

async function fetchImage(src) {
  const image = await axios.get(src, {
    responseType: "arraybuffer",
  });
  return image.data;
}

function generateHeader(doc, xInitial, headerData) {
  doc
    .fontSize(8)
    .text(`Estimation N° ${headerData.orderNumber}`, xInitial)
    .text(`Estimation du ${headerData.quoteDate}`, { align: "center" })
    .moveDown(0.1)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(`Ce devis est émis par la société ${headerData.businessUnitName}`, {
      align: "center",
    })
    .moveDown()
    .image(headerData.logo, {
      fit: [50, 100],
    })
    .moveDown()
    .text(headerData.companyName)
    .font("Helvetica")
    .fillColor("#444444")
    .fontSize(8)
    .text(headerData.addressLine1)
    .text(headerData.addressLine2)
    .text(`Tél : ${headerData.tel}`)
    .text("Fax: ")
    .text(`Email: ${headerData.email}`)
    .text(`N° Siret :${headerData.siret}`)
    .text("Code APE: ")
    .moveDown();
}

function generateClientSection(doc, clientData) {
  doc
    .polygon([360, 117], [360, 220], [560, 220], [560, 117])
    .stroke()
    .fontSize(10)
    .fillColor("white")
    .text("Client", 360, 120, { width: 200, align: "center" })
    .fillColor("black")
    .text(clientData.name, 365, 135, { width: 300, align: "left" })
    .text(clientData.addressLine1, 365, 150, { width: 300, align: "left" })
    .text(clientData.addressLine2, 365, 160, { width: 300, align: "left" })
    .text(`Tél: ${clientData.tel} `, 365, 180, { width: 100, align: "left" })
    .text(`Mobile: ${clientData.mobile}`, 365, 190, {
      width: 150,
      align: "left",
    })
    .text(`Fax: ${clientData.fax}`, 365, 200, { width: 90, align: "left" })
    .text(`Email : ${clientData.email}`, 365, 210, {
      width: 200,
      align: "left",
    });
}

function generateVehiculeSection(doc, xInitial, vehiculeData) {
  doc
    .polygon([xInitial, 237], [xInitial, 315], [559, 315], [559, 237])
    .stroke()
    .fillColor("white")
    .text("Véhicule", 0, 240, { width: 600, align: "center" })
    .fillColor("black")
    .moveDown()
    .text("Marque", xInitial, 255)
    .text(vehiculeData.marque, 160, 255)
    .text("Modèle: ", 250, 255)
    .text(vehiculeData.model, 320, 255)
    .text("Puissance: ", 440, 255)
    .text(vehiculeData.puissance, 500, 255)
    .moveDown()
    .text("Type mine", xInitial, 270)
    .text(vehiculeData.type_myne, 160, 270)
    .text("Carrosserie: ", 250, 270)
    .text(vehiculeData.carrosserie, 320, 270)
    .moveDown()
    .text("Immatriculation:", xInitial, 285)
    .text(vehiculeData.immatriculation, 160, 285)
    .text("Kilométrage: ", 250, 285)
    .text(vehiculeData.kilometrage, 320, 285)
    .moveDown()
    .text("N° Série : ", 250, 300)
    .text(vehiculeData.n_serie, 320, 300)
    .moveDown();
}

function generateLineItemsTitleSection(doc, xInitial) {
  doc
    .fontSize(10)
    .polygon([xInitial, 327], [xInitial, 359], [559, 359], [559, 327])
    .stroke()
    .fillColor("#0f5e95")
    .font("Helvetica-Bold")
    .text("EQUIPEMENTIER", xInitial, 330, { width: 90, align: "center" })
    .text("DÉSIGNATION", xInitial + 100, 330, { width: 200, align: "center" })
    .text("QTÉ", xInitial + 300, 330, { width: 25, align: "center" })
    .text("PRIX UNITAIRE", xInitial + 325, 330, {
      width: 50,
      align: "center",
    })
    .text("PRIX NET", xInitial + 375, 330, {
      width: 30,
      align: "center",
    })
    .text("MONTANT € HT", xInitial + 405, 330, {
      width: 50,
      align: "center",
    })
    .text("MONTANT TTC", xInitial + 465, 330, {
      width: 50,
      align: "center",
    })
    .fillColor("black")
    .font("Helvetica")
    .moveDown();
}

function generateLineItemRow(doc, xInitial, yPosition, item, language) {
  let equipmentier;
  if (item.variant) {
    equipmentier = getAttributeValue(
      item?.variant?.attributes,
      "marque-eligible"
    );
  } else {
    equipmentier = item?.slug;
  }
  doc
    .fontSize(9)
    .polygon(
      [xInitial, yPosition - 10],
      [xInitial, yPosition + 20],
      [559, yPosition + 20],
      [559, yPosition - 10]
    )
    .stroke()
    .text(equipmentier || "", xInitial, yPosition, {
      width: 90,
      align: "center",
    })
    .text(item.name?.[language], xInitial + 100, yPosition, {
      width: 200,
      align: "center",
    })
    .text(item.quantity, xInitial + 300, yPosition, {
      width: 25,
      align: "center",
    })
    .text(
      item?.price?.value?.centAmount / 100 || item.money.centAmount / 100,
      xInitial + 325,
      yPosition,
      {
        width: 50,
        align: "center",
      }
    )
    .text(
      item.taxedPrice.totalNet.centAmount / 100,
      xInitial + 375,
      yPosition,
      {
        width: 30,
        align: "center",
      }
    )
    .text(
      item.taxedPrice.totalNet.centAmount / 100,
      xInitial + 405,
      yPosition,
      {
        width: 50,
        align: "center",
      }
    )
    .text(
      item.taxedPrice.totalGross.centAmount / 100,
      xInitial + 465,
      yPosition,
      {
        width: 50,
        align: "center",
      }
    );
}

function generateTotalTitleSection(doc, yPosition, xInitial) {
  doc
    .fontSize(10)
    .fillColor("#0f5e95")
    .font("Helvetica-Bold")
    .text("TOTAL HT", xInitial, yPosition, { width: 100, align: "center" })
    .text("TVA", xInitial + 100, yPosition, { width: 40, align: "center" })
    .text("TOTAL TVA", xInitial + 140, yPosition, {
      width: 100,
      align: "center",
    })
    .text("TOTAL TTC", xInitial + 240, yPosition, {
      width: 100,
      align: "center",
    })
    .fillColor("black")
    .font("Helvetica");
}

function generateTotalDataSection(doc, yPosition, xInitial, totalData) {
  doc
    .fontSize(10)
    .polygon(
      [xInitial, yPosition - 18],
      [xInitial, yPosition + 20],
      [xInitial + 320, yPosition + 20],
      [xInitial + 320, yPosition - 18]
    )
    .stroke()
    .fillColor("black")
    .text(`${totalData.totalPrice}`, xInitial, yPosition, {
      width: 100,
      align: "center",
    })
    .text(`${totalData.orderTVA}`, xInitial + 100, yPosition, {
      width: 40,
      align: "center",
    })
    .text(`${totalData.totalTVA}`, xInitial + 140, yPosition, {
      width: 100,
      align: "center",
    })
    .text(`${totalData.grandTotal}`, xInitial + 240, yPosition, {
      width: 100,
      align: "center",
    });
}

function getAttributeValue(object, name) {
  const found = object.find((element) => element.name === name);

  return found.value;
}

function generateFinalCommentsSection(doc, yPosition, xInitial) {
  doc
    .fontSize(10)
    .polygon(
      [xInitial, yPosition - 3],
      [xInitial, yPosition + 100],
      [xInitial + 320, yPosition + 100],
      [xInitial + 320, yPosition - 3]
    )
    .stroke()
    .fillColor("white")
    .text("Etat du véhicule à la réception", xInitial, yPosition, {
      width: 320,
      align: "center",
    })
    .text("Signature client", xInitial + 330, yPosition, {
      width: 190,
      align: "center",
    })
    .moveDown()
    .fillColor("black")
    .text(
      `Sous réserve d'autres anomalies constatées au démontage. Estimation gratuite valable 1 mois (sauf stipulation contraire). Acompte à la commande (30% min), solde à la livraison.
    
    Réserve de propriété: les marchandises objet de ce document restent notre propriétéj jusqu'au paiement intégral (Loi n?80.335 du 12/05/1980 et du 25/01/1985 article 121).`,
      xInitial,
      yPosition + 20,
      {
        columns: 1,
        height: 100,
        width: 320,
        align: "left",
      }
    )
    .polygon(
      [xInitial + 330, yPosition - 3],
      [xInitial + 330, yPosition + 100],
      [xInitial + 520, yPosition + 100],
      [xInitial + 520, yPosition - 3]
    )
    .stroke()
    .text(
      `Pour acceptation.
      Mention manuscrite «Bon pour accord» :

Le :`,
      xInitial + 330,
      yPosition + 20,
      {
        columns: 1,
        height: 100,
        width: 190,
        align: "left",
      }
    );
}
async function buildPDF(dataCallback, endCallback, orderNumber) {
  const order = await fetchCt(`orders/${orderNumber}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    });
  console.log("Order");
  console.log(JSON.stringify(order));

  const customerId = order.custom.fields["end-customer"];

  const vehiculeData = {
    marque: getAttributeValue(order.lineItems[0].variant.attributes, "marque"),
    type_myne: getAttributeValue(
      order.lineItems[0].variant.attributes,
      "type-mine"
    ),
    immatriculation: getAttributeValue(
      order.lineItems[0].variant.attributes,
      "plaque-immat"
    ),
    model: getAttributeValue(order.lineItems[0].variant.attributes, "modele"),
    carrosserie: "MO",
    kilometrage: "195666",
    n_serie: "",
    puissance: getAttributeValue(
      order.lineItems[0].variant.attributes,
      "puissance-chvx"
    ),
  };

  console.log("-----------------");
  console.log("Vehicule");
  console.log(vehiculeData);
  console.log("-----------------");
  const customer = await fetchCt(`customers/${customerId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    });

  console.log("Customer:");
  console.log(JSON.stringify(customer));
  console.log("-----------------");

  const businessUnitKey = order.businessUnit.key;

  const businessUnit = await fetchCt(`business-units/key=${businessUnitKey}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    });

  console.log("Business Unit:");
  console.log(JSON.stringify(businessUnit));
  console.log("-----------------");

  const businessUnitAssociate = await fetchCt(
    `customers/${businessUnit.associates[0].customer.id}`,
    { method: "GET" }
  )
    .then((response) => response.json())
    .then((response) => {
      return response;
    });

  console.log("Business unit associate:");
  console.log(JSON.stringify(businessUnitAssociate));

  const logo = await fetchImage(
    businessUnit?.custom?.fields?.logoUrl ||
      "https://www3.autossimo.com/build/images/actu/logo.png"
  );

  const inputDate = new Date(order.createdAt);
  const day = String(inputDate.getDate()).padStart(2, "0");
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const year = inputDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  //Customer on the order is gonna be the buyer
  const headerData = {
    orderNumber: order.orderNumber || "9999",
    businessUnitName: businessUnit?.name,
    logo: logo,
    quoteNumber: order.id,
    quoteDate: formattedDate,
    addressLine1:
      businessUnit?.addresses[0]?.streetNumber +
      " " +
      businessUnit?.addresses[0]?.streetName,
    addressLine2:
      businessUnit?.addresses[0]?.postalCode +
      " " +
      businessUnit?.addresses[0]?.city,
    tel: businessUnitAssociate?.addresses[0]?.phone,
    email: businessUnitAssociate?.email,
    siret: businessUnitAssociate?.vatId,
    companyName: businessUnitAssociate?.companyName,
  };

  //Client will be the custom info
  const clientData = {
    name: customer?.firstName + " " + customer?.lastName,
    addressLine1:
      customer?.addresses[0]?.streetNumber +
      " " +
      customer?.addresses[0]?.streetName,
    addressLine2:
      customer?.addresses[0]?.postalCode + " " + customer?.addresses[0]?.city,
    tel: customer?.addresses[0]?.phone,
    mobile: customer?.addresses[0]?.mobile,
    fax: customer.addresses[0].fax || ``,
    email: customer.email || ``,
  };

  const totalData = {
    totalPrice: `${order.totalPrice.centAmount / 100} ${
      order.totalPrice.currencyCode
    }`,
    orderTVA: `20 %`,
    totalTVA: `${order.taxedPrice.totalTax.centAmount / 100} ${
      order.taxedPrice.totalTax.currencyCode
    }`,
    grandTotal: `${order.taxedPrice.totalGross.centAmount / 100} ${
      order.taxedPrice.totalGross.currencyCode
    }`,
  };

  let language = "";
  switch (order.shippingAddress.country) {
    case "FR":
      language = "fr-FR";
      break;
    case "US":
      language = "en-US";
      break;
    case "DE":
      language = "de-DE";
      break;
    default:
      language = "fr-FR";
  }

  const yInitial = 40;
  const xInitial = 40;
  const lineItems = [...order.lineItems, ...order.customLineItems];

  const doc = new PDFDocument({ size: "A4" });
  doc.on("data", dataCallback);
  doc.on("end", endCallback);
  generateHeader(doc, xInitial, headerData);
  doc.fontSize(10).rect(360, 117, 200, 15).fill("#0f5e96");
  generateClientSection(doc, clientData);
  doc.fontSize(10).rect(xInitial, 237, 520, 15).fill("#0f5e96");
  generateVehiculeSection(doc, xInitial, vehiculeData);
  doc.fontSize(10).rect(xInitial, 328, 520, 30).fill("#d0e4f6");
  generateLineItemsTitleSection(doc, xInitial);
  let yPosition = 370;
  lineItems.map((item) => {
    generateLineItemRow(doc, xInitial, yPosition, item, language);
    yPosition += 30;
    if (yPosition > 725) {
      doc.addPage();
      yPosition = xInitial + 20;
    }
  });

  yPosition += 50;
  doc
    .fontSize(10)
    .rect(xInitial, yPosition - 3, 320, 15)
    .fill("#d0e4f6");
  generateTotalTitleSection(doc, yPosition, xInitial);
  yPosition += 15;
  generateTotalDataSection(doc, yPosition, xInitial, totalData);
  yPosition += 50;
  doc
    .fontSize(10)
    .rect(xInitial, yPosition - 3, 320, 15)
    .fill("#0f5e96");
  doc
    .fontSize(10)
    .rect(xInitial + 330, yPosition - 3, 190, 15)
    .fill("#0f5e96");
  generateFinalCommentsSection(doc, yPosition, xInitial);
  doc.end();
}

export { buildPDF };
