const baseURL = '.';

const routes = {
	login: () => `${baseURL}/api/login`,
	signup: () => `${baseURL}/api/signup`,
	post: () => `${baseURL}/api/post`,
	chatPost: () => `${baseURL}/api/chat`,
	deleteChatPost: postId => `${baseURL}/api/chat/${postId}`,
	chatComment: postId => `${baseURL}/api/chat/comment/${postId}`,
	track: () => `${baseURL}/api/tracker`,
	delete: postId => `${baseURL}/api/post/${postId}`,
};

window.routes = routes;
