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

import { getUsers, createUser, getNotes } from "./api/client";
import Sidebar from "./components/sidebar/Sidebar";
import Main from "./components/main/Main";
import Modal from "./components/modal/Modal";
import Signup from "./components/auth/Signup";

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
		// getNotes().then(response => {
		// 	setNoteList(response.reverse());
		// });

		// getUsers().then(response => {
		// 	if (response.length < 1) {
		// 		createUser({
		// 			name: "Kyungbae Min",
		// 			email: "kyungbae.min@stonybrook.edu",
		// 			location: "Cheongju-si",
		// 			img: "https://lh3.googleusercontent.com/a-/AOh14GiFLMqlkh3kt7_q5kWdnHOFAT79ze413y3GqV-iLGc=s96-c",
		// 		}).then(response => {
		// 			setCurrentUser(response);
		// 		});
		// 	} else {
		// 		setCurrentUser(response[0]);
		// 	}
		// });

		setWindowDimensions(wd => getWindowDimensions());
		function handleResize() {
			setWindowDimensions(wd => getWindowDimensions());
		}
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="layout">
			{/* {windowDimensions.width > 500 ? (
				<>
					<Sidebar /> <Main />
				</>
			) : (
				!showModal && (isEditMode ? <Main /> : <Sidebar />)
			)}
			{showModal && <Modal />} */}
			<Signup />
		</div>
	);
}

export default App;
