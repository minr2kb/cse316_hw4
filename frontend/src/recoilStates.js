const { atom } = require("recoil");

export const noteListState = atom({
	key: "noteListState",
	default: [],
});

export const queriedNoteListState = atom({
	key: "queriedNoteListState",
	default: [],
});

export const currentNoteIdxState = atom({
	key: "currentNoteIdxState",
	default: -1,
});

export const currentNoteState = atom({
	key: "currentNoteState",
	default: "",
});

export const currentUserState = atom({
	key: "currentUserState",
	default: null,
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

export const showSignupState = atom({
	key: "showSignupState",
	default: false,
});

export const isLoggedInState = atom({
	key: "isLoggedInState",
	default: false,
});

export const searchTargetState = atom({
	key: "searchTargetState",
	default: "",
});
