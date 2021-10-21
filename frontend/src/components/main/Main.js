import React from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import {
	noteListState,
	currentNoteState,
	windowDimensionsState,
	isEditModeState,
} from "../../recoilStates";
import { updateNote, createNote } from "../../api/noteAPI";
import ReactMarkdown from "react-markdown";
import { NoteAdd, ArrowBack } from "@mui/icons-material";

const Main = () => {
	const [noteList, setNoteList] = useRecoilState(noteListState);
	const [currentNote, setCurrentNote] = useRecoilState(currentNoteState);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);

	const saveNotes = newNotes => {
		localStorage.setItem("noteList", JSON.stringify(newNotes));
	};

	function getDate() {
		let today = new Date();
		let year = today.getFullYear();
		let month = today.getMonth() + 1;
		let day = today.getDate();
		return month + "/" + day + "/" + year;
	}

	const editNote = e => {
		const newNotes = [
			...noteList.slice(0, currentNote),
			{ content: e.target.value, date: getDate() },
			...noteList.slice(currentNote + 1, noteList.length),
		];
		setNoteList(notes => newNotes);
		saveNotes(newNotes);
		// setNoteList(notes => [
		// 	{ content: e.target.value, date: getDate() },
		// 	...notes.slice(0, currentNote),
		// 	...notes.slice(currentNote + 1, noteList.length),
		// ]);
		// setCurrentNote(current => 0);
	};

	const addNote = () => {
		const newNotes = [{ content: "", date: getDate() }, ...noteList];
		setNoteList(notes => newNotes);
		setCurrentNote(current => 0);
		saveNotes(newNotes);
	};

	const offFocus = () => {
		setCurrentNote(current => -1);
	};

	return (
		<div className="main-body">
			<div className="row main-header">
				<ArrowBack
					style={{
						visibility:
							windowDimensions.width > 500 ? "hidden" : "visible",
					}}
					onClick={() => {
						setIsEditMode(mode => false);
						// offFocus();
					}}
				/>
				<NoteAdd onClick={addNote} />
			</div>
			<div style={{ display: "flex", height: "100%", width: "100%" }}>
				<textarea
					className="main-content"
					id="note"
					readOnly={currentNote < 0}
					value={noteList[currentNote]?.text || ""}
					placeholder={
						currentNote >= 0 && "Start to write a new note!"
					}
					onChange={editNote}
				></textarea>
				{windowDimensions.width > 700 && (
					<ReactMarkdown className="main-decoder">
						{noteList[currentNote]?.text || ""}
					</ReactMarkdown>
				)}
			</div>
		</div>
	);
};

export default Main;
