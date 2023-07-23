import client from '../utils/api/client';
import { catchError } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import { updateNotification } from '../utils/utils';
import React, { useState } from 'react';
import './Register.css';

import { Formik } from 'formik';
import * as Yup from 'yup';

// Components
import Notification from '../components/Notification';
// Images
import cloudImage from '../assets/images/clouds.svg';
// Icons
import { FiUser, FiArrowRight, FiLock } from 'react-icons/fi';
import {
	AiOutlineCheckCircle,
	AiFillCheckCircle,
	AiOutlineEye,
	AiOutlineEyeInvisible,
} from 'react-icons/ai';

function Login() {
	const [message, setMessage] = useState({
		text: '',
		type: '',
	});

	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const [long, longEnough] = useState(false);
	const [number, hasNumber] = useState(false);
	const [upper, hasUpper] = useState(false);
	const [noSpaces, hasNoSpaces] = useState(false);

	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const navigate = useNavigate();
	const logIn = async (values) => {
		try {
			const { data } = await client.post('/users/login', { ...values });
			return data;
		} catch (error) {
			return catchError(error);
		}
	};
	const initialValues = {
		username: '',
		email: '',
		password: '',
		confirmpassword: '',
	};

	const validationSchema = Yup.object({
		username: Yup.string()
			.required('Username is required')
			.min(3, 'must be at least 3 characters long'),
		email: Yup.string().required('Email is required').email(),
		password: Yup.string().required('Password is required'),
		confirmpassword: Yup.string().required('Please confirm your password'),
	});

	const handleSignUp = async (values, formikActions) => {
		console.log(values);

		if (!long || !number || !upper || !noSpaces) {
			console.log(false);
			setPasswordError("Your password doesn't meet the requirements");
		} else if (values.password != values.confirmpassword) {
			setConfirmPasswordError('Passwords dont match');
		} else {
			setPasswordError('');
			setConfirmPasswordError('');
			const res = await logIn(values);

			if (!res.success) return updateNotification(setMessage, res.error);

			navigate('/');
			formikActions.resetForm();
			console.log(res);
		}
	};

	return (
		<div className="register-container">
			{message.text && <Notification type={message.type} text={message.text} />}
			<img src={cloudImage} alt="" className="clouds" />
			<div className="register">
				<h2>Register</h2>
				<h3>Create your account</h3>

				<Formik
					initialValues={initialValues}
					enableReinitialize={true}
					validationSchema={validationSchema}
					onSubmit={handleSignUp}
					validate={(values) => {
						setPasswordError('');
						values.password.length < 8 ? longEnough(false) : longEnough(true);
						!/\d/.test(values.password) ? hasNumber(false) : hasNumber(true);
						/\s/.test(values.password) ? hasNoSpaces(false) : hasNoSpaces(true);
						/[A-Z]/.test(values.password) ? hasUpper(true) : hasUpper(false);
					}}
				>
					{(formik) => (
						<form className="form" onSubmit={formik.handleSubmit}>
							<div className="error">
								{formik.touched.username && formik.errors.username ? (
									<div className="error">{formik.errors.username}</div>
								) : null}
							</div>
							<div className="textbox">
								<input
									type="text"
									autoComplete="off"
									{...formik.getFieldProps('username')}
								/>
								<label>Username *</label>
								<span>
									<FiUser />
								</span>
							</div>

							<div className="error">
								{formik.touched.email && formik.errors.email ? (
									<div className="error">{formik.errors.email}</div>
								) : null}
							</div>
							<div className="textbox">
								<input
									type="text"
									autoComplete="off"
									{...formik.getFieldProps('email')}
								/>
								<label>Email *</label>
								<span>
									<FiUser />
								</span>
							</div>

							<div className="error">
								{formik.touched.password && formik.errors.password ? (
									<div className="error">{formik.errors.password}</div>
								) : null}
							</div>
							<div className="error">
								{passwordError ? (
									<div className="error">{passwordError}</div>
								) : null}
							</div>
							<div className="textbox">
								<input
									type={passwordVisible ? 'text' : 'password'}
									autoComplete="off"
									{...formik.getFieldProps('password')}
								/>
								<label>Password *</label>
								<span>
									<FiUser />
								</span>

								<div
									className="eye"
									onClick={() => setPasswordVisible(!passwordVisible)}
								>
									{passwordVisible ? (
										<AiOutlineEyeInvisible />
									) : (
										<AiOutlineEye />
									)}
								</div>
							</div>

							<div className="error">
								{formik.touched.confirmpassword &&
								formik.errors.confirmpassword ? (
									<div className="error">{formik.errors.confirmpassword}</div>
								) : null}
							</div>
							<div className="error">
								{confirmPasswordError ? (
									<div className="error">{confirmPasswordError}</div>
								) : null}
							</div>
							<div className="textbox">
								<input
									type={confirmPasswordVisible ? 'text' : 'password'}
									autoComplete="off"
									{...formik.getFieldProps('confirmpassword')}
								/>
								<label>Confirm password *</label>
								<span>
									<FiUser />
								</span>
								<div
									className="eye"
									onClick={() =>
										setConfirmPasswordVisible(!confirmPasswordVisible)
									}
								>
									{confirmPasswordVisible ? (
										<AiOutlineEyeInvisible />
									) : (
										<AiOutlineEye />
									)}
								</div>
							</div>
							<p>
								Already have an account?
								<a href="/login"> Login here</a>
							</p>

							<button type="submit">
								Next
								<span>
									<FiArrowRight />
								</span>
							</button>
						</form>
					)}
				</Formik>

				<div className="password-requirements">
					<h1>Password must have:</h1>

					<div>
						{long ? (
							<AiFillCheckCircle size={32} color="#216ce7" />
						) : (
							<AiOutlineCheckCircle size={32} color="#216ce7" />
						)}
						At least 8 characters
					</div>

					<div>
						{number ? (
							<AiFillCheckCircle size={32} color="#216ce7" />
						) : (
							<AiOutlineCheckCircle size={32} color="#216ce7" />
						)}
						At least one number
					</div>

					<div>
						{upper ? (
							<AiFillCheckCircle size={32} color="#216ce7" />
						) : (
							<AiOutlineCheckCircle size={32} color="#216ce7" />
						)}
						At least one uppercase letter
					</div>

					<div>
						{noSpaces ? (
							<AiFillCheckCircle size={32} color="#216ce7" />
						) : (
							<AiOutlineCheckCircle size={32} color="#216ce7" />
						)}
						No spaces
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
