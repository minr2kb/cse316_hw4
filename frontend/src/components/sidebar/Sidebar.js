import React from "react";
import { useState } from "react";
import defaultUser from "../../assets/image/defaultUser.jpeg";
import { useRecoilState } from "recoil";
import {
	noteListState,
	currentNoteState,
	windowDimensionsState,
	isEditModeState,
	showModalState,
	currentUserState,
	searchTargetState,
} from "../../recoilStates";
import { deleteNoteById } from "../../api/client";
import { Delete, Search } from "@mui/icons-material";

const Sidebar = () => {
	const [noteList, setNoteList] = useRecoilState(noteListState);
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
		if (queriedList.length > 0) {
			viewNote(0);
		} else {
			offFocus();
		}
	};

	const viewNote = idx => {
		console.log(`view: ${idx}`);
		setCurrentNote(() => idx);
		setIsEditMode(() => true);
	};

	const offFocus = () => {
		setCurrentNote(() => -1);
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
		if (currentNote >= 0) {
			let queriedList = noteList.filter((note, idx) =>
				note.text
					.replace(/[ \n]/g, "")
					.toLowerCase()
					.includes(searchTarget.replace(/[ \n]/g, "").toLowerCase())
			);
			deleteNoteById(queriedList[currentNote]._id).then(response => {
				setNoteList(notes =>
					noteList.filter(
						note => note._id !== queriedList[currentNote]._id
					)
				);
				if (currentNote > queriedList.length - 2 && currentNote > -1) {
					viewNote(currentNote - 1);
				}
			});
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
					src={currentUser.img || defaultUser}
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
				{noteList
					.filter(note =>
						note.text
							.replace(/[ \n]/g, "")
							.toLowerCase()
							.includes(
								searchTarget.replace(/[ \n]/g, "").toLowerCase()
							)
					)
					.map((note, idx) => (
						<div
							className={
								"row side-note" +
								(currentNote === idx ? " selected" : "")
							}
							key={idx}
							onClick={() => viewNote(idx)}
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
