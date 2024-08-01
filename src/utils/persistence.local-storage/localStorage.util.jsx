export const persistLocalStorage = (key, value) => {
	localStorage.setItem(key, JSON.stringify({ ...value }));
};

export const clearLocalStorage = (key) => {
	localStorage.removeItem(key);
};
