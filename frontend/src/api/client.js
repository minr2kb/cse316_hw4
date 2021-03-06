const defaultHeaders = {
	headers: {
		"Content-Type": "application/json; charset=UTF-8",
	},
};

export const getUser = () => {
	return fetch(`/api/user`, {
		...defaultHeaders,
	}).then(response => {
		if (response.status >= 500) {
			return null;
		} else {
			return parseJSON(response);
		}
	});
};

export const updateUser = user => {
	return fetch(`/api/user`, {
		...defaultHeaders,
		method: "PUT",
		body: JSON.stringify(user),
	}).then(checkStatus);
};

export const register = (name, email, password) => {
	return fetch(`/api/register`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify({
			name: name,
			email: email,
			password: password,
		}),
	}).then(response => {
		if (response.status >= 500) {
			return "duplicated";
		}
		return "success";
	});
};

export const login = (email, password) => {
	return fetch(`/api/login`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	}).then(response => {
		if (response.status < 400) {
			return "success";
		} else {
			return "failed";
		}
	});
};

export const logout = () => {
	return fetch(`/api/logout`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify([]),
	}).then(checkStatus);
};

export const getNotes = () => {
	return fetch(`/api/notes`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const createNote = note => {
	return fetch(`/api/notes`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify(note),
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const updateNote = note => {
	return fetch(`/api/notes/${note._id}`, {
		...defaultHeaders,
		method: "PUT",
		body: JSON.stringify(note),
	}).then(checkStatus);
};

export const deleteNoteById = noteId => {
	return fetch(`/api/notes/${noteId}`, {
		...defaultHeaders,
		method: "DELETE",
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const uploadImageToCloudinaryAPIMethod = formData => {
	const cloudName = "ddrzspgjy"; // TODO: Write in your own Cloudinary account
	return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
		// We do NOT want to set the default headers ??? the formData will automatically set the
		// headers to tell the server of the data type (which is different than the JSON
		// standard all the other API calls have been sending
		method: "POST",
		body: formData,
	})
		.then(checkStatus)
		.then(parseJSON);
};

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		const error = new Error(`${response.statusText}`);
		error.status = response.statusText;
		error.response = response;
		throw error;
	}
}

function parseJSON(response) {
	return response.json();
}
