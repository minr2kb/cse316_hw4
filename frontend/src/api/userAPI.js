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

export const getUsers = () => {
	return fetch(`/api/users/`, {
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

export const createUser = user => {
	return fetch(`/api/users`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify(user),
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
