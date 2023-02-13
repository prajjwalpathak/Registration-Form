const unsetMessage = (elementId) => {
	document.getElementById(elementId + "-message").innerText = "";
};

const setMessage = (control, message) => {
	document.getElementById(control + "-message").innerText = message;
};

const validateName = (event) => {
	const val = event.target.value;
	const checkName = /^[A-Za-z\s]+$/;
	if (val == "") {
		setMessage("username", "Please write your name");
	} else if (!val.match(checkName)) {
		setMessage("username", "Invalid name");
	} else {
		unsetMessage("username");
	}
};

const validateEmail = (event) => {
	const val = event.target.value;
	if (val == "") {
		setMessage("email", "Please write an email id");
	} else if (
		val.lastIndexOf(".") == val.length - 1 ||
		val.lastIndexOf(".") <= val.indexOf("@") + 1 ||
		val.indexOf("@") < 1
	) {
		setMessage("email", "Invalid email id");
	} else {
		unsetMessage("email");
	}
};

const validatePassword = (event) => {
	const val = event.target.value;
	if (val == "") {
		setMessage("password", "Please write a password");
	} else if (val.length < 6) {
		setMessage("password", "Password should be of 6 or more characters");
	} else {
		unsetMessage("password");
	}
};

const validatePhone = (event) => {
	const val = event.target.value;
	if (val == "") {
		setMessage("phone", "Please write your Phone Number");
	} else if (val.length != 10) {
		setMessage("phone", "Invalid Phone Number");
	} else {
		unsetMessage("phone");
	}
};

const validateTechnology = (event) => {
	const val = event.target.value;
	if (val == "none") {
		setMessage("technology", "Select a Technology");
	} else {
		unsetMessage("technology");
	}
};

const validateSkills = (event) => {
	const val = event.target.value;
	if (val == "none") {
		setMessage("skills", "Select atleast one Skill");
	} else {
		unsetMessage("skills");
	}
};

const validateTermsCheck = (event) => {
	if (!event.target.checked) {
		setMessage("termsCheck", "Please accept the Terms & Conditions");
	} else {
		unsetMessage("termsCheck");
	}
};
