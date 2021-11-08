const defaultHeaders = {
	headers: {
		"Content-Type": "application/json; charset=UTF-8",
	},
};

export const getUserById = userId => {
	return fetch(`/api/users/${userId}`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const updateUser = user => {
	return fetch(`/api/users/${user._id}`, {
		...defaultHeaders,
		method: "PUT",
		body: JSON.stringify(user),
	}).then(checkStatus);
};

export const deleteUserById = userId => {
	return fetch(`/api/users/${userId}`, {
		...defaultHeaders,
		method: "DELETE",
	})
		.then(checkStatus)
		.then(parseJSON);
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
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const login = (email, password) => {
	return fetch(`/api/login`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const logout = () => {
	return fetch(`/api/login`, {
		...defaultHeaders,
		method: "POST",
	})
		.then(checkStatus)
		.then(parseJSON);
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
	console.log(noteId);
	return fetch(`/api/notes/${noteId}`, {
		...defaultHeaders,
		method: "DELETE",
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
