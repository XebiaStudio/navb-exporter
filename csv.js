export const parseCsv = (result, delimiter = ",") => {
  const [heading, ...rows] = result.replace(/"/g, "").split("\n");
  const parsedHeading = heading.split(delimiter);

  return rows
    .map(row => row.split(delimiter))
    .map(row => {
      const rowObject = {};
      parsedHeading.forEach((heading, index) => {
        rowObject[heading] = row[index];
      });
      return rowObject;
    });
};

export const generateCsv = (array, delimiter = ";") =>
  [Object.keys(array[0]).join(delimiter)]
    .concat(array.map(row => Object.values(row).join(delimiter)))
    .join("\n");
