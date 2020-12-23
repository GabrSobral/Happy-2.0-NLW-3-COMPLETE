import User from "../models/users";

export default {
  render(user: User) {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  },

  renderMany(users: User[]) {
    return users.map(user => this.render(user));
  }
}