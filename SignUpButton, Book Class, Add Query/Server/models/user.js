let User = (id, fname, lname,dob, phnum, email, password, role) => {
    this.UserId = id;
    this.FirstName = fname;
    this.LastName = lname;
    this.DateOfBirth = dob;
    this.PhoneNumber = phnum;
    this.Email = email;
    this.Password = password;
    this.Role = role;
}

module.exports = User;