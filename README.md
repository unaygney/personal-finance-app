# Personal Finance App 🚀

Personal Finance App is a modern web application developed as part of a
challenge on Frontend Mentor. The app provides an intuitive platform for users
to manage their budgets by categorizing expenses as negative and incomes as
positive values, ensuring a clear and efficient financial overview.

## Key Features 🌟

- **Expense and Income Management**: Record expenses as negative values and
  incomes as positive values for easy budget tracking.
- **User-Friendly Interface**: Designed to provide a seamless user experience
  with an intuitive and responsive UI.
- **Secure and Scalable**: Built with performance and security in mind, ensuring
  user data is safe.

## Authentication and Security 🔐

- **Access and Refresh Token Management**: The application uses JWTs (JSON Web
  Tokens) for managing user sessions securely.
  - **Access Tokens**: These are short-lived tokens that are valid for **15
    minutes**. After expiration, a new access token is generated using the
    refresh token.
  - **Refresh Tokens**: These are securely stored in **Redis**, a fast,
    in-memory data store, to enhance security and performance. Refresh tokens
    allow users to stay logged in without needing to re-authenticate frequently.
- **Token Renewal**: Access tokens are automatically renewed every **15
  minutes** using refresh tokens, ensuring a balance between security and
  usability.
- This setup ensures a balance between user experience (staying logged in) and
  security (short-lived access tokens).

## Technologies Used 🛠️

- **Next.js**: A React framework for production.
- **TypeScript**: Strongly typed programming language for JavaScript.
- **Prisma**: Next-generation ORM for database management.
- **PostgreSQL**: Reliable and robust database solution.
- **React Query**: Data-fetching library for managing server state.
- **Framer Motion**: For smooth animations and transitions.
- **shadcn/ui**: For a modern, stylish UI component library.
- **Redis**: Used for storing refresh tokens securely and managing session
  state.

## Demo Login Credentials

To see a demo with pre-filled data, you can log in with the following
credentials:

- **Email**: `test@finance.com`
- **Password**: `Test1234`

## License 📄

This project is licensed under the MIT License.

## Acknowledgements 🙏

This project was developed based on a challenge from
[Frontend Mentor](https://www.frontendmentor.io/), utilizing the provided
professional Figma design.

---
