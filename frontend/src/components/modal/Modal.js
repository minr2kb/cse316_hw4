import React, { useState, useEffect } from "react";
import "../../App.css";
import defaultUser from "../../assets/image/defaultUser.jpeg";
import { useRecoilState } from "recoil";
import {
	windowDimensionsState,
	showModalState,
	currentUserState,
} from "../../recoilStates";
import {
	updateUser,
	logout,
	uploadImageToCloudinaryAPIMethod,
} from "../../api/client";
import { Close } from "@mui/icons-material";

const Modal = () => {
	const [windowDimensions, setWindowDimensions] = useRecoilState(
		windowDimensionsState
	);
	const [showModal, setShowModal] = useRecoilState(showModalState);
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [location, setLocation] = useState("");
	const [changed, setChanged] = useState(false);
	const [imageURL, setImageURL] = useState(null);
	const [file, setFile] = useState(null);
	const [error, setError] = useState(null);
	const [loadingIndicator, setLoadingIndicator] = useState(null);

	const submit = () => {
		if (name.length > 0 && location.length > 0) {
			if (file) {
				setError(null);
				setLoadingIndicator("Uploading image...");
				const formData = new FormData();
				const unsignedUploadPreset = "g53pwqfw";
				formData.append("file", file);
				formData.append("upload_preset", unsignedUploadPreset);
				// formData.append("public_id", currentUser._id);
				uploadImageToCloudinaryAPIMethod(formData).then(response => {
					setLoadingIndicator("Saving...");
					var updatedUser = {
						...currentUser,
						name: name,
						location: location,
						profile_url: response.url,
					};
					updateUser(updatedUser).then(response => {
						setLoadingIndicator(null);
						if (response.ok) {
							setCurrentUser(updatedUser);
							window.alert("Saved all changes");
						} else {
							window.alert("Failed to save changes");
						}
						setShowModal(() => false);
					});
				});
			} else {
				setError(null);
				setLoadingIndicator("Saving...");
				var updatedUser = {
					...currentUser,
					name: name,
					location: location,
					profile_url: "",
				};
				updateUser(updatedUser).then(response => {
					setLoadingIndicator(null);
					if (response.ok) {
						setCurrentUser(updatedUser);
						window.alert("Saved all changes");
					} else {
						window.alert("Failed to save changes");
					}
					setShowModal(() => false);
				});
			}
		} else {
			setError("Cannot save the empty information");
		}
	};

	// const submit

	const handleImageSelected = event => {
		console.log("New File Selected");
		if (event.target.files && event.target.files[0]) {
			const selectedFile = event.target.files[0];
			const fileURL = URL.createObjectURL(selectedFile);
			setFile(selectedFile);
			setImageURL(fileURL);
			setChanged(true);
		}
	};

	const removeImage = () => {
		setChanged(true);
		setImageURL(null);
		setFile(null);
	};

	const signout = () => {
		if (window.confirm("Do you want to logout?")) {
			logout().then(response => {
				window.location.reload();
			});
		}
	};

	const closeModal = () => {
		if (changed) {
			window.confirm("Do you want to save the changes before closing?") &&
				submit();
		}
		setShowModal(() => false);
	};

	const editName = e => {
		setName(e.target.value);
		setChanged(true);
	};

	// const editEmail = e => {
	// 	setEmail(e.target.value);
	// 	setChanged(true);
	// };

	const editLocation = e => {
		setLocation(e.target.value);
		setChanged(true);
	};

	useEffect(() => {
		setName(currentUser?.name);
		setEmail(currentUser?.email);
		setLocation(currentUser?.location);
		setImageURL(currentUser?.profile_url);
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
						<Close
							onClick={closeModal}
							style={{ cursor: "pointer" }}
						/>
					</div>
					<div className="modal-image">
						<img src={imageURL || defaultUser} alt="profile" />
						<label>
							<input
								type="file"
								name="image"
								accept="image/*"
								id="cloudinary"
								onChange={handleImageSelected}
							/>
							<div className="selectable-text">
								Choose New Image
							</div>
						</label>
						<div className="selectable-text" onClick={removeImage}>
							Remove Image
						</div>
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
								// onChange={editEmail}
								type="email"
								readOnly={true}
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
					{error && (
						<div
							style={{
								color: "red",
								fontWeight: 600,
								fontSize: "large",
							}}
						>
							{error}
						</div>
					)}
					{loadingIndicator && (
						<div
							style={{
								color: "green",
								fontWeight: 600,
								fontSize: "large",
							}}
						>
							{loadingIndicator}
						</div>
					)}

					<div className="modal-footer">
						<input
							className="save-button selectable-text"
							onClick={submit}
							value="Save"
							type="submit"
						/>

						<div className="selectable-text" onClick={signout}>
							Logout
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
