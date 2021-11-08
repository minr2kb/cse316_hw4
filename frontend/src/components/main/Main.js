import React, { useCallback, useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import {
	noteListState,
	currentNoteState,
	windowDimensionsState,
	isEditModeState,
	searchTargetState,
} from "../../recoilStates";
import { updateNote, createNote } from "../../api/client";
import ReactMarkdown from "react-markdown";
import { NoteAdd, ArrowBack } from "@mui/icons-material";

const Main = () => {
	const [noteList, setNoteList] = useRecoilState(noteListState);
	const [currentNote, setCurrentNote] = useRecoilState(currentNoteState);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [searchTarget, setSearchTarget] = useRecoilState(searchTargetState);
	const [text, setText] = useState("");

	const debounce = useCallback((func, timeout = 1000) => {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}, []);

	const handleText = e => {
		setText(e.target.value);
		debouncedSave(noteList, currentNote, e.target.value);
	};

	const debouncedSave = useCallback(
		debounce((noteList, currentNote, newText) =>
			editNote(noteList, currentNote, newText)
		),
		[]
	);

	const editNote = (noteList, currentNote, newText) => {
		const newNote = {
			...noteList[currentNote],
			text: newText,
		};
		updateNote(newNote).then(response => {
			setNoteList(notes => [
				newNote,
				...noteList.slice(0, currentNote),
				...noteList.slice(currentNote + 1, noteList.length),
			]);
			setCurrentNote(0);
		});
	};

	const addNote = () => {
		const newNote = { text: "", lastUpdatedDate: new Date().toString() };
		setSearchTarget(() => "");
		createNote(newNote).then(response => {
			setNoteList([response, ...noteList]);
			setCurrentNote(() => 0);
		});
	};

	const offFocus = () => {
		setCurrentNote(current => -1);
	};

	useEffect(() => {
		console.log("UseEffect");
		let queriedList = noteList.filter((note, idx) =>
			note.text
				.replace(/[ \n]/g, "")
				.toLowerCase()
				.includes(searchTarget.replace(/[ \n]/g, "").toLowerCase())
		);
		setText(queriedList[currentNote]?.text);
	}, [currentNote, noteList, searchTarget]);

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
					value={text || ""}
					placeholder={
						currentNote >= 0 ? "Start to write a new note!" : ""
					}
					onChange={handleText}
					// onKeyUp={editNote}
				></textarea>
				{windowDimensions.width > 700 && (
					<ReactMarkdown className="main-decoder">
						{text || ""}
					</ReactMarkdown>
				)}
			</div>
		</div>
	);
};

export default Main;
