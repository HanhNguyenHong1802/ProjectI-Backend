const Users = require('./models/users.js');

var defaultUser =  {
	    username: "admin",
	    password: "admin",
	    isAdmin: true
}

Users.register(new Users({username: defaultUser.username}), 
defaultUser.password, async (err,user) => {
	// if(err) { next(err); }
	if(err) {}
	else {
		user.isAdmin = defaultUser.isAdmin;
		var savedUser = await user.save();
	    console.log('Created the default user:'+savedUser);	
	}
});
