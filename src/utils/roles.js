export const isManagerUser = (user) =>
  user && (user.role === 'manager' || user.role === 'personA');

export const isClientUser = (user) => user && user.role === 'client';
