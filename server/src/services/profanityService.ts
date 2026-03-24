import Filter from 'bad-words';

const filter = new Filter();

export const containsProfanity = (text: string): boolean => {
  return filter.isProfane(text);
};

export const cleanText = (text: string): string => {
  return filter.clean(text);
};