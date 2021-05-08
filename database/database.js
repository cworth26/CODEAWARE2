const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USERNAME,
	process.env.DATABASE_PASSWORD,
	{
		host: process.env.DATABASE_HOST,
		dialect: 'mysql',

		pool: {
			max: 5,
			min: 0,
			idle: 10000,
		},
	}
);

const User = sequelize.define(
	'users',
	{
		username: {
			type: Sequelize.STRING,
			field: 'username',
		},
		password: {
			type: Sequelize.STRING,
			field: 'password',
		},
		profilePicture: {
			type: Sequelize.STRING,
			field: 'profile_picture',
		},
	},
	{
		timestamps: false,
	}
);

const Post = sequelize.define(
	'posts',
	{
		link: {
			type: Sequelize.STRING,
			field: 'link',
		},
		description: {
			type: Sequelize.STRING,
			field: 'description',
		},
		icon: {
			type: Sequelize.STRING,
			field: 'icon',
		},
		createdBy: {
			type: Sequelize.STRING,
			field: 'created_by',
		},
	},
	{
		timestamps: false,
	}
);

const ChatPost = sequelize.define(
	'chat_posts',
	{
		message: {
			type: Sequelize.STRING,
			field: 'message',
		},
		image: {
			type: Sequelize.STRING,
			field: 'image',
		},

		createdBy: {
			type: Sequelize.STRING,
			field: 'created_by',
		},
	},
	{
		timestamps: false,
	}
);

const ChatComment = sequelize.define(
	'chat_comments',
	{
		message: {
			type: Sequelize.STRING,
			field: 'message',
		},
		createdBy: {
			type: Sequelize.STRING,
			field: 'created_by',
		},
		postId: {
			type: Sequelize.INTEGER,
			field: 'post_id',
		},
	},
	{
		timestamps: false,
	}
);

const StudyTracker = sequelize.define(
	'study_tracker',
	{
		monday: {
			type: Sequelize.STRING,
			field: 'monday',
		},
		tuesday: {
			type: Sequelize.STRING,
			field: 'tuesday',
		},
		wednesday: {
			type: Sequelize.STRING,
			field: 'wednesday',
		},
		thursday: {
			type: Sequelize.STRING,
			field: 'thursday',
		},
		friday: {
			type: Sequelize.STRING,
			field: 'friday',
		},
		saturday: {
			type: Sequelize.STRING,
			field: 'saturday',
		},
		sunday: {
			type: Sequelize.STRING,
			field: 'sunday',
		},
		userId: {
			type: Sequelize.STRING,
			field: 'user_id',
		},
	},
	{
		timestamps: false,
	}
);

module.exports = {
	User,
	Post,
	ChatPost,
	ChatComment,
	StudyTracker,
};
