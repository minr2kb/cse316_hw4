import React, { useState, useEffect } from "react";
import "../../App.css";
import defaultUser from "../../assets/image/defaultUser.jpeg";
import { useRecoilState } from "recoil";
import {
	windowDimensionsState,
	showModalState,
	currentUserState,
} from "../../recoilStates";
import { updateUser } from "../../api/client";
import { Close } from "@mui/icons-material";

const Signup = () => {
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [showModal, setShowModal] = useRecoilState(showModalState);
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [changed, setChanged] = useState(false);

	const isEmail = email => {
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		return emailRegex.test(email);
	};

	const submit = () => {
		// if (name.length > 0 && email.length > 0 && password.length > 0) {
		// 	if (isEmail(email)) {
		// 		var updatedUser = {
		// 			...currentUser,
		// 			name: name,
		// 			email: email,
		// 			password: password,
		// 		};
		// 		updateUser(updatedUser).then(response => {
		// 			if (response.ok) {
		// 				setCurrentUser(updatedUser);
		// 				// window.alert("Saved all changes");
		// 			} else {
		// 				window.alert("Could not save changes");
		// 			}
		// 			setShowModal(show => false);
		// 		});
		// 	} else {
		// 		window.alert("Email format is invalid");
		// 	}
		// } else {
		// 	window.alert("Cannot save the empty information");
		// }
	};

	const logout = () => {
		// if (window.confirm("Do you want to logout?")) {
		// 	window.alert("Logged out");
		// 	setShowModal(show => false);
		// 	setName("");
		// 	setEmail("");
		// 	setLocation("");
		// 	localStorage.removeItem("profile");
		// }
		window.alert("Not implemented yet");
	};

	const closeModal = () => {
		if (changed) {
			window.confirm("Do you want to save the changes before closing?") &&
				submit();
		}
		setShowModal(show => false);
	};

	const editName = e => {
		setName(e.target.value);
		setChanged(true);
	};

	const editEmail = e => {
		setEmail(e.target.value);
		setChanged(true);
	};

	const editPassword = e => {
		setPassword(e.target.value);
		setChanged(true);
	};

	useEffect(() => {}, []);

	return (
		<div
			className={
				"modal-background" +
				(windowDimensions.width > 500 ? "" : " show")
			}
			onClick={closeModal}
		>
			<div
				className={
					"modal" + (windowDimensions.width > 500 ? "" : " show")
				}
				id="modal"
				onClick={e => e.stopPropagation()}
			>
				<div className="modal-inner">
					<div
						className="modal-header"
						style={{ marginBottom: "10px" }}
					>
						<span style={{ fontWeight: "900", fontSize: "larger" }}>
							Sign Up
						</span>
						<Close onClick={closeModal} />
					</div>

					<div className="modal-info">
						<div>Name</div>
						<div style={{ display: "flex" }}>
							<input
								className="modal-input"
								placeholder="Name"
								value={name}
								onChange={editName}
							/>
						</div>
					</div>
					<div className="modal-info">
						<div>Email</div>
						<div style={{ display: "flex" }}>
							<input
								className="modal-input"
								placeholder="Email"
								value={email}
								onChange={editEmail}
								type="email"
							/>
						</div>
					</div>
					<div className="modal-info">
						<div>Password</div>
						<div style={{ display: "flex" }}>
							<input
								type="password"
								className="modal-input"
								placeholder="Password"
								value={password}
								onChange={editPassword}
							/>
						</div>
					</div>

					<div
						className="modal-footer"
						style={{ justifyContent: "center" }}
					>
						<input
							className="green-button selectable-text"
							onClick={submit}
							value="Sign Up"
							type="submit"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
