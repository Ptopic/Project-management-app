import client from '../utils/api/client';
import { catchError } from '../utils/utils';
import { useNavigate } from 'react-router-dom';
import { updateNotification } from '../utils/utils';
import React, { useState } from 'react';
import './Login.css';

import { Formik } from 'formik';
import * as Yup from 'yup';

// Components
import Notification from '../components/Notification';
// Images
import cloudImage from '../assets/images/clouds.svg';
// Icons
import { FiUser, FiArrowRight, FiLock } from 'react-icons/fi';

function Login() {
	const [message, setMessage] = useState({
		text: '',
		type: '',
	});
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
		password: '',
	};

	const validationSchema = Yup.object({
		username: Yup.string().required('Username is required'),
		password: Yup.string().required('Password is required'),
	});

	const handleLogIn = async (values, formikActions) => {
		console.log(values);
		const res = await logIn(values);

		if (!res.success) return updateNotification(setMessage, res.error);

		navigate('/');
		formikActions.resetForm();
		console.log(res);
	};

	return (
		<div>
			{message.text && <Notification type={message.type} text={message.text} />}
			<img src={cloudImage} alt="" className="clouds" />
			<div className="login">
				<h2>Log in</h2>
				<h3>Welcome back</h3>

				<Formik
					initialValues={initialValues}
					enableReinitialize={true}
					validationSchema={validationSchema}
					onSubmit={handleLogIn}
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
								<label>Username</label>
								<span>
									<FiUser />
								</span>
							</div>
							<div className="error">
								{formik.touched.password && formik.errors.password ? (
									<div className="error">{formik.errors.password}</div>
								) : null}
							</div>
							<div className="textbox">
								<input
									type="password"
									autoComplete="off"
									{...formik.getFieldProps('password')}
								/>
								<label>Password</label>
								<span>
									<FiLock />
								</span>
							</div>

							<p>
								New to the app?
								<a href="/register"> Register here</a>
							</p>

							<button type="submit">
								Login
								<span>
									<FiArrowRight />
								</span>
							</button>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default Login;
