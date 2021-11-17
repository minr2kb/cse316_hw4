const { atom } = require("recoil");

export const noteListState = atom({
	key: "noteListState",
	// default: [
	// 	{
	// 		content:
	// 			"# Example Note\nHello I'm Kyungbae Min.\nI am taking **CSE316**.",
	// 		date: "8/17/2021",
	// 	},
	// 	{
	// 		content:
	// 			"I have a pen, I have an apple, Uh! Apple pen! I have a pen, I have pineapple.. Uh! pineapple pen!",
	// 		date: "8/10/2021",
	// 	},
	// 	{
	// 		content: "Hello Cleopatra\nThe thinnest potato chip in the world",
	// 		date: "7/15/2021",
	// 	},
	// ],
	default: [],
});

export const currentNoteState = atom({
	key: "currentNoteState",
	default: -1,
});

export const currentUserState = atom({
	key: "currentUserState",
	default: {
		name: "",
		email: "",
		location: "",
	},
});

export const windowDimensionsState = atom({
	key: "windowDimensionsState",
	default: { width: 0, height: 0 },
});

export const isEditModeState = atom({
	key: "isEditModeState",
	default: false,
});

export const showModalState = atom({
	key: "showModalState",
	default: false,
});

export const searchTargetState = atom({
	key: "searchTargetState",
	default: "",
});
