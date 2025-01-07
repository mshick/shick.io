import { format } from 'date-fns';

export function toCamelCase(str: string) {
  return str
    ?.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
      idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase(),
    )
    .replace(/\s+/g, '');
}

export function toSnakeCase(str: string) {
  return str
    ?.match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
    )
    ?.map((x) => x.toLowerCase())
    .join('_');
}

export function toPlural(noun: string, suffix = 's', count?: number) {
  if (count) {
    return `${count} ${noun}${count !== 1 ? suffix : ''}`;
  }

  return `${noun}${suffix}`;
}

export function standardDate(date: string) {
  return format(new Date(date), 'yyyy-MM-dd');
}
