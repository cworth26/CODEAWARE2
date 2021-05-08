const button = document.querySelector('.submit-input');
const textareaInput = document.querySelector('.description-input');
const form = document.getElementById('user-input');
const commentInput = document.querySelector('.comment-input');
const submitComment = document.querySelector('.submit-comment');
const commentForm = document.querySelector('#comment-modal');

const post = async () => {
	const img = document.getElementById('uploaded-img');
	const post = {
		message: textareaInput.value,
		image: img.src,
	};
	try {
		await axios.post(routes.chatPost(), post, {
			withCredentials: true,
		});
	} catch (err) {
		console.log(err);
	}
};

form.addEventListener('submit', async e => {
	button.setAttribute('disabled', true);
	e.preventDefault();
	await post();
	button.removeAttribute('disabled');
	location.reload();
});

const handleInput = e => {
	const reader = new FileReader();

	const imgContainer = document.querySelector('.image-wrapper');
	const img = document.getElementById('uploaded-img');

	reader.onload = () => {
		if (reader.readyState === 2) {
			imgContainer.style.backgroundImage = `url('${reader.result}')`;
			img.src = reader.result;
		}
	};

	reader.readAsDataURL(e.target.files[0]);
	e.target.value = '';
};

document.getElementById('file').addEventListener('input', handleInput);

textareaInput.addEventListener('input', () => {
	if (textareaInput.value) {
		button.disabled = false;
	} else {
		button.disabled = true;
	}
});

commentInput.addEventListener('input', () => {
	if (commentInput.value) {
		submitComment.disabled = false;
	} else {
		submitComment.disabled = true;
	}
});

const postComment = async id => {
	console.log(id);
	try {
		console.log(routes.chatComment(id));
		await axios.post(
			routes.chatComment(id),
			{
				message: commentInput.value,
			},
			{ withCredentials: true }
		);
	} catch (err) {
		console.log(err);
	}
};

document.querySelectorAll('.interaction').forEach(btn =>
	btn.addEventListener('click', () => {
		const postId = btn.getAttribute('data-id');
		document.querySelector('.modal').classList.add('show');
		commentForm.addEventListener('submit', async e => {
			e.preventDefault();
			await postComment(postId);
			location.reload();
		});
	})
);

document.querySelector('.add-comment-svg').addEventListener('click', () => {
	document.querySelector('.modal').classList.remove('show');
});

const deletePost = async id => {
	try {
		await axios.delete(routes.deleteChatPost(id), {
			withCredentials: true,
		});
	} catch (err) {
		console.log(err);
	}
};

const trashBtns = document.querySelectorAll('.trash-container');
trashBtns.forEach(btn =>
	btn.addEventListener('click', async () => {
		const id = btn.getAttribute('data-id');
		await deletePost(id);
		location.reload();
	})
);
