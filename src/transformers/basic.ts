import { Transformer } from '../types';

export const capitalize: Transformer<string, string> = (
  str: string
): string => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isoDateToLocal: Transformer<string, Date> = (
  isoString: string
): Date => new Date(isoString);
