export function saveUserToLocalStorage(user) {
  window.localStorage.setItem('user', JSON.stringify(user));
}

export function getUserFromLocalStorage() {
  const userData = window.localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem('user');
}


export const secureHtml = text => {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
};
