import React from "react";
import defaultUser from "../../assets/image/defaultUser.jpeg";
import { useRecoilState } from "recoil";
import {
	noteListState,
	queriedNoteListState,
	currentNoteIdxState,
	currentNoteState,
	windowDimensionsState,
	isEditModeState,
	showModalState,
	currentUserState,
	searchTargetState,
} from "../../recoilStates";
import { deleteNoteById, getNotes } from "../../api/client";
import { Delete, Search } from "@mui/icons-material";

const Sidebar = () => {
	const [noteList, setNoteList] = useRecoilState(noteListState);
	const [queriedNoteList, setQueriedNoteList] =
		useRecoilState(queriedNoteListState);
	const [currentNoteIdx, setCurrentNoteIdx] =
		useRecoilState(currentNoteIdxState);
	const [currentNote, setCurrentNote] = useRecoilState(currentNoteState);
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [showModal, setShowModal] = useRecoilState(showModalState);
	const [searchTarget, setSearchTarget] = useRecoilState(searchTargetState);
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

	const handleSearch = e => {
		setSearchTarget(() => e.target.value);
		let queriedList = noteList.filter((note, idx) =>
			note.text
				.replace(/ /g, "")
				.toLowerCase()
				.includes(e.target.value.replace(/ /g, "").toLowerCase())
		);
		setQueriedNoteList(() => queriedList);
		if (queriedList.length > 0) {
			const idx = queriedList.findIndex(
				(element, index, arr) => element._id == currentNote
			);
			if (idx > 0) {
				viewNote(idx, queriedList[idx]?._id);
			} else {
				viewNote(0, queriedList[0]?._id);
			}
		} else {
			offFocus();
		}
	};

	const viewNote = (idx, noteId) => {
		console.log(`view: ${idx}`);
		setCurrentNoteIdx(() => idx);
		setCurrentNote(() => noteId);
		setIsEditMode(() => true);
	};

	const offFocus = () => {
		setCurrentNoteIdx(() => -1);
		setCurrentNote(() => "");
	};

	const formatDateTime = str => {
		var datetime = new Date(str);
		let day = datetime.getDate();
		let month = datetime.getMonth() + 1;
		let year = datetime.getFullYear();
		let hour =
			datetime.getHours() >= 12
				? datetime.getHours() - 12
				: datetime.getHours();
		let min = datetime.getMinutes();
		let sec = datetime.getSeconds();
		let mer = datetime.getHours() >= 12 ? "PM" : "AM";

		return `${month}/${day}/${year}, ${hour}:${min}:${sec} ${mer}`;
	};

	const deleteNote = () => {
		if (currentNoteIdx >= 0) {
			deleteNoteById(queriedNoteList[currentNoteIdx]._id).then(
				response => {
					getNotes().then(response => {
						let notes = response.reverse();
						setNoteList(() => notes);
						let queriedList = notes.filter((note, idx) =>
							note.text
								.replace(/ /g, "")
								.toLowerCase()
								.includes(
									searchTarget.replace(/ /g, "").toLowerCase()
								)
						);
						setQueriedNoteList(() => queriedList);
						if (
							currentNoteIdx > queriedNoteList.length - 2 &&
							currentNoteIdx > -1
						) {
							viewNote(
								currentNoteIdx - 1,
								queriedList[currentNoteIdx - 1]?._id
							);
						} else {
							viewNote(
								currentNoteIdx,
								queriedList[currentNoteIdx]?._id
							);
						}
					});
				}
			);
		}
	};

	return (
		<div
			className="side-bar"
			style={{ width: windowDimensions.width <= 500 && "100%" }}
		>
			<div className="row side-header">
				<img
					id="profile"
					src={currentUser.profile_url || defaultUser}
					alt="profile"
					onClick={() => setShowModal(show => true)}
				/>
				<div className="logo">My Notes</div>
				<Delete onClick={deleteNote} />
			</div>
			<div className="row side-search">
				<Search />
				<input
					className="search-tab"
					id="search"
					placeholder="Search all notes"
					value={searchTarget}
					onChange={handleSearch}
				/>
			</div>
			<div id="note-list" className="side-note-list">
				{queriedNoteList.map((note, idx) => (
					<div
						className={
							"row side-note" +
							(currentNoteIdx === idx ? " selected" : "")
						}
						key={idx}
						onClick={() => viewNote(idx, queriedNoteList[idx]?._id)}
					>
						<span className="title" id="title">
							{note.text.length > 0
								? note.text
										.split("\n")
										.filter(
											line =>
												line.replace(/[ ]/g, "")
													.length > 0
										)[0]
								: "New Note"}
						</span>
						<span style={{ fontSize: "x-small" }}>
							{formatDateTime(note.lastUpdatedDate)}
							{/* {note.lastUpdatedDate} */}
						</span>
					</div>
				))}
				<div style={{ height: "100%" }} onClick={offFocus}></div>
			</div>
		</div>
	);
};

export default Sidebar;
