import React, { useState, useContext, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Spinner from './Spinner';
import authContext from '../store';
import attemptLogin from '../auth/fakeAuth';

const LoginForm = () => {
	const [ loading, setLoading ] = useState(false);
	const [ formData, setFormData ] = useState({
		username: '',
		password: ''
	});
	const [ { isLoggedIn, error }, dispatch ] = useContext(authContext);

	function onSubmit(event) {
		event.preventDefault();
		setLoading(true);
		attemptLogin(formData)
			.then((username) => {
				dispatch({
					type: 'LOGIN',
					payload: {
						username
					}
				});
			})
			.catch((error) => {
				dispatch({
					type: 'LOGIN_ERROR',
					payload: {
						error
					}
				});
			})
			.finally(() => {
				setLoading(false);
			});
	}

	function onChange(event) {
		const { name, value } = event.target;
		setFormData((formData) => ({
			...formData,
			[name]: value
		}));
	}

	return (
		<Fragment>
			{isLoggedIn ? (
				<Redirect to="/" />
			) : (
				<Fragment>
					<Link to="/">Back to home</Link>
					{error && <p className="error">{error}</p>}
					<form onSubmit={onSubmit}>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={onChange}
							placeholder="Username"
						/>
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={formData.password}
							onChange={onChange}
						/>
						<button type="submit" disabled={loading}>
							{!!loading && <Spinner width="15px" />}
							<span>{!!loading ? 'Please wait' : 'Log In'}</span>
						</button>
					</form>
				</Fragment>
			)}
		</Fragment>
	);
};

export default LoginForm;
