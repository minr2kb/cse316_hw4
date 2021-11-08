import React from "react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { showSignupState } from "../../recoilStates";
import { login, getUser } from "../../api/client";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);

	const [showSignup, setShowSignup] = useRecoilState(showSignupState);

	const editEmail = e => {
		setEmail(e.target.value);
	};

	const editPassword = e => {
		setPassword(e.target.value);
	};

	const submit = () => {
		login(email, password).then(response => {
			if (response == "success") {
				window.location.reload();
			} else {
				setError(true);
			}
		});
	};

	return (
		<div className="login-background" onClick={() => setError(false)}>
			<h1 style={{ fontWeight: 900, margin: 0 }}>Notes</h1>
			<h3 style={{ fontWeight: 900 }}>
				Organize all your thoughts in one place.
			</h3>
			<div
				className="login"
				id="login"
				onClick={e => e.stopPropagation()}
			>
				<div className="login-inner">
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
								className="modal-input"
								placeholder="Password"
								value={password}
								onChange={editPassword}
								type="password"
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
							Error: Invalid email and/or password
						</div>
					)}
					<div
						style={{
							paddingTop: 10,
							paddingBottom: 20,
							borderBottom: "solid 1px grey",
						}}
					>
						<input
							className="login-button selectable-text"
							onClick={submit}
							value="Log In"
							type="submit"
						/>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							paddingTop: 20,
							paddingBottom: 10,
						}}
					>
						<input
							className="green-button selectable-text"
							onClick={() => {
								setShowSignup(() => true);
								setError(false);
							}}
							value="Create New Account"
							type="submit"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
