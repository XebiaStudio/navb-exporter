import { generateCsv, parseCsv } from "./csv.js";
import {
  capitalize,
  groupBy,
  fileToText,
  downloadFileToDisk,
  formatDate
} from "./util.js";

const list = document.getElementById("upload-event-list");
const fileUpload = document.getElementById("file-upload");

const mapToNavbFormat = data =>
  data.map(order => {
    const addressLine = order["Adres (Straat + huisnummer)"].split(" ");
    const houseNumber = addressLine[addressLine.length - 1];
    const street = addressLine.slice(0, addressLine.length - 1).join(" ");
    return {
      tussenvoegsel: order["Naam (Tussenvoegsel)"],
      achternaam: capitalize(order["Naam (Achternaam)"]),
      voornaam: capitalize(order["Naam (Voornaam)"]),
      "geboortedatum (dd-mm-jjjj)": formatDate(
        order["Geboortedatum (dd-mm-jjjj)"]
      ),
      postcode: order["Adres (Postcode)"].toUpperCase(),
      straat: street,
      huisnummer: houseNumber,
      "huisnummer toevoeging": order["Adres (Huisnummer toevoeging)"],
      stad: capitalize(order["Adres (Stad)"]),
      "E-mailadres": order["E-mailadres"]
    };
  });

fileUpload.addEventListener("change", async e => {
  list.innerHTML = "";

  const result = await fileToText(e.target.files[0]);
  const parsedRows = parseCsv(result);
  const orders = groupBy(parsedRows, "Bestelnummer");

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
        const csvExport = generateCsv(mapToNavbFormat(orders[value.target.id]));
        downloadFileToDisk(csvExport);
      });
    });
});
