const renderHome = (req, res) => {
    if (req.cookies["active"]) {
        const activeUserEmail = JSON.parse(req.cookies["active"]).email;
        const activeUserData = JSON.parse(req.cookies[activeUserEmail]);
        res.render("home", {
            username: activeUserData.username,
            email: activeUserData.email,
            phone: activeUserData.phone,
            technology: activeUserData.technology,
            skills: activeUserData.skills,
            termsCheck: activeUserData.termsCheck,
        });
    } else {
        res.render("error.ejs");
    }
};

module.exports = renderHome;
