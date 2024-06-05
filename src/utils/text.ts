export function toCamelCase(str: string) {
  return str
    ?.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
      idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()
    )
    .replace(/\s+/g, '')
}

export function toSnakeCase(str: string) {
  return str
    ?.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )
    ?.map((x) => x.toLowerCase())
    .join('_')
}
