const defaultHeaders = {
	headers: {
		"Content-Type": "application/json; charset=UTF-8",
	},
};

const baseURL = "http://localhost:5000/";

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

export const updateNote = note => {
	return fetch(`${baseURL}/api/notes/${note._id}`, {
		...defaultHeaders,
		method: "PUT",
		body: JSON.stringify(note),
	}).then(checkStatus);
};

export const deleteNoteById = noteId => {
	return fetch(`${baseURL}/api/notes/${noteId}`, {
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
