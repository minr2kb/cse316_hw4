import React, { useState, useEffect } from "react";
import "../../App.css";
import me from "../../assets/image/me.jpg";
import { useRecoilState } from "recoil";
import { windowDimensionsState, showModalState } from "../../recoilStates";
import { Close } from "@mui/icons-material";

const Modal = () => {
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [showModal, setShowModal] = useRecoilState(showModalState);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [location, setLocation] = useState("");
	const [changed, setChanged] = useState(false);

	const submit = () => {
		localStorage.setItem(
			"profile",
			JSON.stringify({ name: name, email: email, location: location })
		);
		window.alert("Saved all changes");
		setShowModal(show => false);
	};

	const logout = () => {
		if (window.confirm("Do you want to logout?")) {
			window.alert("Logged out");
			setShowModal(show => false);
			setName("");
			setEmail("");
			setLocation("");
			localStorage.removeItem("profile");
		}
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

	const editLocation = e => {
		setLocation(e.target.value);
		setChanged(true);
	};

	useEffect(() => {
		if (localStorage.getItem("profile") !== null) {
			const profile = JSON.parse(localStorage.getItem("profile"));
			setName(profile.name);
			setEmail(profile.email);
			setLocation(profile.location);
		}
	}, []);

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
					<div className="modal-header">
						<span style={{ fontWeight: 900, fontSize: "larger" }}>
							Edit Profile
						</span>
						<Close onClick={closeModal} />
					</div>
					<div className="modal-image">
						<img src={me} alt="profile" />
						<div className="selectable-text">Choose New Image</div>
						<div className="selectable-text">Remove Image</div>
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
							/>
						</div>
					</div>
					<div className="modal-info">
						<div>Location</div>
						<div style={{ display: "flex" }}>
							<input
								className="modal-input"
								placeholder="Location"
								value={location}
								onChange={editLocation}
							/>
						</div>
					</div>

					<div className="modal-footer">
						<div
							className="save-button selectable-text"
							onClick={submit}
						>
							Save
						</div>

						<div className="selectable-text" onClick={logout}>
							Logout
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
