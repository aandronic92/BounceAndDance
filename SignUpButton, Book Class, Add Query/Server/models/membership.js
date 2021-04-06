function Membership(id = 0, inst = 0, name, sessions, price) {

    this.membershipId = id;
    this.instructorId = inst;
    this.membershipName = name;
    this.membershipSessions = sessions;
    this.membershipPrice = price;
}

module.exports = Membership;