import React, { useCallback, useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import {
	noteListState,
	currentNoteState,
	windowDimensionsState,
	isEditModeState,
} from "../../recoilStates";
import {
	updateNote,
	createNote,
	getNotes,
	deleteNoteById,
} from "../../api/noteAPI";
import ReactMarkdown from "react-markdown";
import { NoteAdd, ArrowBack } from "@mui/icons-material";

const Main = () => {
	const [noteList, setNoteList] = useRecoilState(noteListState);
	const [currentNote, setCurrentNote] = useRecoilState(currentNoteState);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [text, setText] = useState("");

	function debounce(func, timeout = 300) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	const handleText = e => {
		setText(e.target.value);
	};

	const editNote = useCallback(
		debounce(() => {
			const newNote = {
				...noteList[currentNote],
				text: text,
			};
			updateNote(newNote).then(response => {
				setNoteList(notes => [
					...noteList.slice(0, currentNote),
					newNote,
					...noteList.slice(currentNote + 1, noteList.length),
				]);
			});
			// // console.log(noteList[currentNote]);
			console.log(currentNote);
			console.log(text);
			console.log(newNote);
		})
	);

	const addNote = () => {
		const newNote = { text: "", lastUpdatedDate: new Date().toString() };
		createNote(newNote).then(response => {
			getNotes().then(response => {
				console.log(response);
				setNoteList(response.reverse());
				setCurrentNote(current => 0);
			});
		});
	};

	const offFocus = () => {
		setCurrentNote(current => -1);
	};

	useEffect(() => {
		setText(noteList[currentNote]?.text);
	}, [currentNote]);

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
					onKeyUp={editNote}
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
