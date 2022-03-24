export const getNameLabel = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase();
};

export const getUserFirstName = (name: string): string => {
  return name?.split(' ')?.shift() || '';
};