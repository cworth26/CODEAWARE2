const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('.login');
const form = document.getElementById('login');
const routes = window.routes;

const postAuthInfo = async () => {
	const username = usernameInput.value;
	const password = passwordInput.value;

	try {
		const response = await axios.post(
			routes.login(),
			{
				username,
				password,
			},
			{ withCredentials: true }
		);

		const location = response.request.responseURL;
		window.location.href = location;
	} catch (err) {
		if (err.response) {
			const erorrContainer = document.querySelector('.error');
			erorrContainer.textContent = err.response.data.error;
		}
	}
};

form.addEventListener('input', () => {
	if (usernameInput.value && passwordInput.value) {
		loginButton.disabled = false;
	} else {
		loginButton.disabled = true;
	}
});

form.addEventListener('submit', e => {
	e.preventDefault();
	postAuthInfo();
});
