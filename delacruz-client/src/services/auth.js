export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('type') || '';
export const getFirstName = () => localStorage.getItem('firstName') || '';
export const getLastName = () => localStorage.getItem('lastName') || '';
export const isAuthenticated = () => Boolean(getToken());

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('type');
  localStorage.removeItem('firstName');
  localStorage.removeItem('lastName');
  localStorage.removeItem('email');
};
