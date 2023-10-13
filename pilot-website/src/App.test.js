import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Login component", () => {
  render(<App />);
  const loginElement = screen.getByText(/login/i);
  expect(loginElement).toBeInTheDocument();
});
