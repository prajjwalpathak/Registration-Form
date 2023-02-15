let fetchData = fetch("http://localhost:3000/employee-data");

let employees = [];

fetchData
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        employees = data;
    })
    .catch((error) => {
        console.log(error);
    });

const getEmployees = (filteredEmployees) => {
    const placeholder = document.getElementById("table-body");
    let out = "";
    for (let employee of filteredEmployees) {
        out += `
            <tr>
            <td class="empid-data">${employee.empid}</td>
            <td class="name-data">${employee.personal.name}</td>
            <td class="gender-data">${employee.personal.gender}</td>
            <td class="age-data">${employee.personal.age}</td>
            <td class="address-data">${employee.personal.address.streetaddress}, ${employee.personal.address.city}, ${employee.personal.address.state}, ${employee.personal.address.postalcode}</td>
            <td class="designation-data">${employee.profile.designation}</td>
            <td class="department-data">${employee.profile.department}</td>
            </tr>
        `;
    }
    placeholder.innerHTML = out;
};

const getAllEmployees = () => {
    getEmployees(employees);
};

const getFilteredEmployees = () => {
    const search = document.getElementById("search").value;
    let filteredEmployees = employees.filter((employee) => {
        return JSON.stringify(employee).toLowerCase()
        .includes(search.toLowerCase());
    });
    getEmployees(filteredEmployees);
};
