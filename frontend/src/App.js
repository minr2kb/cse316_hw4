import "./App.css";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
	noteListState,
	windowDimensionsState,
	isEditModeState,
	showModalState,
} from "./recoilStates";
import { getNotes } from "./api/noteAPI";
import Sidebar from "./components/sidebar/Sidebar";
import Main from "./components/main/Main";
import Modal from "./components/modal/Modal";

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

function App() {
	const [noteList, setNoteList] = useRecoilState(noteListState);
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [showModal, setShowModal] = useRecoilState(showModalState);

	useEffect(() => {
		// localStorage.removeItem("noteList");

		// if (localStorage.getItem("noteList") !== null) {
		// 	setNoteList(notes => JSON.parse(localStorage.getItem("noteList")));
		// }
		getNotes().then(response => {
			console.log(response);
			setNoteList(response.reverse());
		});

		setWindowDimensions(wd => getWindowDimensions());
		function handleResize() {
			setWindowDimensions(wd => getWindowDimensions());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="layout">
			{windowDimensions.width > 500 ? (
				<>
					<Sidebar /> <Main />
				</>
			) : (
				!showModal && (isEditMode ? <Main /> : <Sidebar />)
			)}
			{showModal && <Modal />}
		</div>
	);
}

export default App;
