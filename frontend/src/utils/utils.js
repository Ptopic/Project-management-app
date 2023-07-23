export const catchError = (error) => {
	if (error?.response?.data) {
		return error.response.data;
	} else {
		return { success: false, error: error.message };
	}
};

export const updateNotification = (updater, text, type = 'error') => {
	updater({ text, type });
	setTimeout(() => {
		updater({ text: '', type: '' });
	}, 2500);
};
