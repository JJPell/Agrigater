let redirectToSignIn = (self) => {

    localStorage.removeItem("token");
    self.props.history.push('/signin')

};

let isToken = (self) => {

    if(!localStorage.getItem("token")) {
        redirectToSignIn(self);
    }

};

let isAuthenticated = (self) => {

	return new Promise((resolve, reject) => {
		if(self.props.data && self.props.data.error && self.props.data.error.graphQLErrors) {
			self.props.data.error.graphQLErrors.forEach(error => {
				if(error.code && error.code === "UNAUTHENTICATED") {
	
					redirectToSignIn(self);
					reject();
	
				} else {
					resolve();
				}
			});
		} else if(self.props.listFarms && self.props.listFarms.error && self.props.listFarms.error.graphQLErrors) {
			self.props.listFarms.error.graphQLErrors.forEach(error => {
				if(error.code && error.code === "UNAUTHENTICATED") {
	
					redirectToSignIn(self);
					reject();

				} else {
					resolve();
				}
			});
		} else {
			resolve();
		}
	});


};


export { isAuthenticated, isToken, redirectToSignIn };