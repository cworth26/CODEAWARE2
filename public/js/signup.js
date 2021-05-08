const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmedPassword = document.getElementById('confirmed-password');
const form = document.getElementById('login');
const button = document.querySelector('.login');
const routes = window.routes;

form.addEventListener('input', () => {
	if (usernameInput.value && passwordInput.value && confirmedPassword.value) {
		button.disabled = false;
	} else {
		button.disabled = true;
	}
});

const addError = message => {
	const error = document.querySelector('.error');
	error.textContent = message;
};
form.addEventListener('submit', async e => {
	e.preventDefault();
	const username = usernameInput.value;
	const password = passwordInput.value;
	if (username < 4) {
		addError('Username too short');
	} else if (password < 4) {
		addError('Password too short');
	} else if (password !== confirmedPassword.value) {
		addError('Passwords do not match');
	} else {
		try {
			const response = await axios.post(
				routes.signup(),
				{ username, password },
				{ withCredentials: true }
			);
			const location = response.request.responseURL;
			window.location.href = location;
		} catch (err) {
			if (err.response) {
				addError(err.response.data.error);
			}
		}
	}
});
