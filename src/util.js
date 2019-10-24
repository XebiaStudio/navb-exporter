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

export const fileToText = async file => {
  return new Promise(resolve => {
    const fr = new FileReader();
    fr.onload = e => resolve(e.target.result);
    fr.readAsText(file);
  });
};
