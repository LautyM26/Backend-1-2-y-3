export default class UserDTO {
    constructor({ _id, first_name, last_name, email, age, role }) {
      this.id         = _id
      this.firstName  = first_name
      this.lastName   = last_name
      this.email      = email
      this.age        = age
      this.role       = role
    }
  }  