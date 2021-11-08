import React, { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import {
	windowDimensionsState,
	showSignupState,
	currentUserState,
} from "../../recoilStates";
import { register } from "../../api/client";
import { Close } from "@mui/icons-material";

const Signup = () => {
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [showSignup, setShowSignup] = useRecoilState(showSignupState);
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const isEmail = email => {
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		return emailRegex.test(email);
	};

	const submit = () => {
		if (window.confirm("Do you want to sign up with this information?")) {
			if (isEmail(email)) {
				register(name, email, password).then(response => {
					if (response == "duplicated") {
						window.alert("This email is already been registered.");
						setEmail("");
					} else {
						if (password.length < 6) {
							window.alert(
								"Password should be a minimum of 6 characters"
							);
						} else {
							window.alert("Welcome!");
							closeModal();
						}
					}
				});
			} else {
				window.alert("Email is invalid.");
			}
		}
	};

	const clear = () => {
		setName("");
		setEmail("");
		setPassword("");
	};

	const closeModal = () => {
		clear();
		setShowSignup(() => false);
	};

	const editName = e => {
		setName(e.target.value);
	};

	const editEmail = e => {
		setEmail(e.target.value);
	};

	const editPassword = e => {
		setPassword(e.target.value);
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
						<Close
							onClick={closeModal}
							style={{ cursor: "pointer" }}
						/>
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
