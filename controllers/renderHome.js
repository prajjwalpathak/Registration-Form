const renderHome = (req, res) => {
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
}

module.exports = renderHome;