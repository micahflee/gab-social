// https://github.com/danny-wood/unslugify/blob/master/index.js
export default function unslugify(text) {
  const result = `${text}`.replace(/\-/g, " ");
  return result.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
