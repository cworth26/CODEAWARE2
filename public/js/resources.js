const linkInput = document.querySelector('.link-input');
const descInput = document.querySelector('.description-input');
const form = document.getElementById('user-input');
const button = document.querySelector('.submit-input');

const deleteResource = async postId => {
	try {
		await axios.delete(routes.delete(postId), {
			withCredentials: true,
		});
	} catch (err) {
		console.log(err);
	}
};

document.querySelectorAll('.trash-wrapper').forEach(button => {
	button.addEventListener('click', async () => {
		const postId = button.getAttribute('data-post-id');
		await deleteResource(postId);
		location.reload();
	});
});

form.addEventListener('input', () => {
	if (linkInput.value && descInput.value) {
		button.disabled = false;
	} else {
		button.disabled = true;
	}
});

const postResource = async (link, description) => {
	try {
		await axios.post(
			window.routes.post(),
			{
				link: link,
				description: description,
			},
			{ withCredentials: true }
		);
	} catch (err) {
		console.log(err);
	}
};

form.addEventListener('submit', async e => {
	e.preventDefault();
	const link = linkInput.value;
	const description = descInput.value;
	await postResource(link, description);
	location.reload();
});
