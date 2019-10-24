import { generateCsv, parseCsv } from "./csv.js";
import { capitalize, groupBy, fileToText } from "./util.js";

const list = document.getElementById("upload-event-list");
const fileUpload = document.getElementById("file-upload");
const fileUploadContainer = document.getElementById("file-upload-container");
const evenListContainer = document.getElementById("event-list-container");

let orders = null;

const exportToNavb = data =>
  generateCsv(
    data.map(order => {
      let formattedDate =
        "Invalid date format: " + order["Geboortedatum (dd-mm-jjjj)"];
      try {
        formattedDate = new Intl.DateTimeFormat("nl", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric"
        }).format(new Date(order["Geboortedatum (dd-mm-jjjj)"]));
      } catch (e) {
        console.log(e);
      }
      const addressLine = order["Adres (Straat + huisnummer)"].split(" ");
      const houseNumber = addressLine[addressLine.length - 1];
      const street = addressLine.slice(0, addressLine.length - 1).join(" ");
      return {
        tussenvoegsel: order["Naam (Tussenvoegsel)"],
        achternaam: capitalize(order["Naam (Achternaam)"]),
        voornaam: capitalize(order["Naam (Voornaam)"]),
        "geboortedatum (dd-mm-jjjj)": formattedDate,
        postcode: order["Adres (Postcode)"].toUpperCase(),
        straat: street,
        huisnummer: houseNumber,
        "huisnummer toevoeging": order["Adres (Huisnummer toevoeging)"],
        stad: capitalize(order["Adres (Stad)"]),
        "E-mailadres": order["E-mailadres"]
      };
    })
  );

const downloadFile = (blob, filename = "navbexport.csv") => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/csv;charset=utf-8,${encodeURIComponent(blob)}`
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

fileUpload.addEventListener("change", e => {
  window.e = e;
  console.log(e);
  fileToText(e.target.files[0]).then(result => {
    const parsedRows = parseCsv(result);
    fileUploadContainer.style.display = "none";
    evenListContainer.style.display = "block";

    orders = groupBy(parsedRows, "Bestelnummer");

    Object.entries(orders)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([key, values]) => {
        const row = document.createElement("tr");

        row.innerHTML = `
					<td>${key}</td>
					<td>${values.length}</td>
					<td class="has-text-right">
					    <button class="button is-small is-dark" id="${key}">
					        <span class="icon is-small" id="${key}">
                                <i class="fas fa-fingerprint" id="${key}"></i>
                            </span>
					        <span id="${key}">Exporteer</span>
                        </button
					</td>
				`;
        list.appendChild(row);
        document.getElementById(key).addEventListener("click", value => {
          const csvExport = exportToNavb(orders[value.target.id]);
          downloadFile(csvExport);
        });
      });
  });
});
