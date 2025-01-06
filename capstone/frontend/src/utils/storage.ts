const USER_KEY = "user";

export const setStoredUser = (user: object) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};
