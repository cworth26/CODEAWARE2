const forms = document.querySelectorAll('.hours-form');

const postHour = async (day, hours) => {
	try {
		await axios.post(
			routes.track(),
			{
				day,
				hours,
			},
			{ withCredentials: true }
		);
	} catch (err) {
		console.log(err);
	}
};

forms.forEach(form => {
	form.addEventListener('submit', async e => {
		e.preventDefault();
		const day = form.parentElement.firstElementChild.textContent;
		const hours = form.querySelector('.input').value;
		await postHour(day, hours);
		location.reload();
	});
});
