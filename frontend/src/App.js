import "./App.css";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
	noteListState,
	windowDimensionsState,
	isEditModeState,
	showModalState,
	currentUserState,
} from "./recoilStates";
import { getNotes } from "./api/noteAPI";
import { getUsers, createUser } from "./api/userAPI";
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
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [showModal, setShowModal] = useRecoilState(showModalState);

	useEffect(() => {
		getNotes().then(response => {
			setNoteList(response.reverse());
		});

		getUsers().then(response => {
			if (response.length < 1) {
				createUser({
					name: "Kyungbae Min",
					email: "kyungbae.min@stonybrook.edu",
					location: "Cheongju-si",
				}).then(response => {
					setCurrentUser(response);
				});
			} else {
				setCurrentUser(response[0]);
			}
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
