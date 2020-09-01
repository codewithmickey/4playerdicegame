var config = {
	port: 4000,
	secret: 'secret',
	redisUrl: 'redis://localhost',
	routes: {
		login: '/login',
		logout: '/logout'
	}
};

module.exports = config;