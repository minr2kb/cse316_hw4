const defaultHeaders = {
	headers: {
		"Content-Type": "application/json; charset=UTF-8",
	},
};

const baseURL = "http://localhost:5000/";

export const getUserById = userId => {
	return fetch(`${baseURL}/api/users/${userId}`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const updateUser = user => {
	return fetch(`${baseURL}/api/users/${user._id}`, {
		...defaultHeaders,
		method: "PUT",
		body: JSON.stringify(user),
	}).then(checkStatus);
};

export const deleteUserById = userId => {
	return fetch(`${baseURL}/api/users/${userId}`, {
		...defaultHeaders,
		method: "DELETE",
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const createUser = user => {
	return fetch(`${baseURL}/api/users`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify(user),
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const getNotes = () => {
	return fetch(`${baseURL}/api/notes`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON);
};

export const createNote = note => {
	return fetch(`${baseURL}/api/notes`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify(note),
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
