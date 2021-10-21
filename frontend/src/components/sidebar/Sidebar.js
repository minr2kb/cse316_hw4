import React from "react";
import { useState } from "react";
import me from "../../assets/image/me.jpg";
import { useRecoilState } from "recoil";
import {
	noteListState,
	currentNoteState,
	windowDimensionsState,
	isEditModeState,
	showModalState,
} from "../../recoilStates";
import { Delete, Search } from "@mui/icons-material";

const Sidebar = () => {
	const [noteList, setNoteList] = useRecoilState(noteListState);
	const [currentNote, setCurrentNote] = useRecoilState(currentNoteState);
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [showModal, setShowModal] = useRecoilState(showModalState);
	const [searchTarget, setSearchTarget] = useState("");

	const saveNotes = newNotes => {
		localStorage.setItem("noteList", JSON.stringify(newNotes));
	};

	const handleSearch = e => {
		setSearchTarget(e.target.value);
		offFocus();
	};

	const viewNote = idx => {
		setCurrentNote(() => idx);
		setIsEditMode(() => true);
	};

	const offFocus = () => {
		setCurrentNote(current => -1);
	};

	const deleteNote = () => {
		const newNotes = noteList.filter((note, idx) => idx !== currentNote);
		setNoteList(notes => newNotes);
		if (currentNote > noteList.length - 2 && currentNote > -1) {
			setCurrentNote(current => current - 1);
		}
		saveNotes(newNotes);
	};

	return (
		<div
			className="side-bar"
			style={{ width: windowDimensions.width <= 500 && "100%" }}
		>
			<div className="row side-header">
				<img
					id="profile"
					src={me}
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
				{noteList.map(
					(note, idx) =>
						note.text
							.replace(" ", "")
							.toLowerCase()
							.includes(searchTarget.toLowerCase()) && (
							<div
								className={
									"row side-note" +
									(currentNote === idx ? " selected" : "")
								}
								key={idx}
								onClick={() => viewNote(idx)}
							>
								<span className="title" id="title">
									{note.text.split("\n")[0] || "New Note"}
								</span>
								<span style={{ fontSize: "x-small" }}>
									{note.lastUpdatedDate}
								</span>
							</div>
						)
					// console.log(note)
				)}
				<div style={{ height: "100%" }} onClick={offFocus}></div>
			</div>
		</div>
	);
};

export default Sidebar;
