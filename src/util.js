export const groupBy = (array, key) =>
  array
    .filter(item => item[key])
    .reduce((acc, cur) => {
      if (acc[cur[key]]) {
        acc[cur[key]].push(cur);
        return acc;
      }
      return { ...acc, [cur[key]]: [cur] };
    }, {});

export const capitalize = input =>
  !input || input.length < 1
    ? input
    : input[0].toUpperCase() + input.slice(1).toLowerCase();

export const formatDate = input => {
  try {
    return new Intl.DateTimeFormat("nl", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    }).format(new Date(input));
  } catch (e) {
    console.log(e);
    return `Invalid date format: ${input}`;
  }
};

export const fileToText = async file => {
  return new Promise(resolve => {
    const fr = new FileReader();
    fr.onload = e => resolve(e.target.result);
    fr.readAsText(file);
  });
};

export const downloadFileToDisk = (blob, filename = "navbexport.csv") => {
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

export const prevent = cb => e => {
  e.preventDefault();
  return cb(e);
};
