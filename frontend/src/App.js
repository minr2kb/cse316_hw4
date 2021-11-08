import "./App.css";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
	noteListState,
	windowDimensionsState,
	isEditModeState,
	showModalState,
	showSignupState,
	currentUserState,
	isLoggedInState,
} from "./recoilStates";

import { login, getUser, getNotes } from "./api/client";
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
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
	const [showModal, setShowModal] = useRecoilState(showModalState);
	const [showSignup, setShowSignup] = useRecoilState(showSignupState);

	useEffect(() => {
		getUser().then(response => {
			if (response) {
				setCurrentUser(() => response);
				getNotes().then(response => {
					setNoteList(() => response.reverse());
				});
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
			{currentUser ? (
				<>
					{windowDimensions.width > 500 ? (
						<>
							<Sidebar /> <Main />
						</>
					) : (
						!showModal && (isEditMode ? <Main /> : <Sidebar />)
					)}
					{showModal && <Modal />}
				</>
			) : (
				<>{showSignup && <Signup />}</>
			)}
		</div>
	);
}

export default App;
