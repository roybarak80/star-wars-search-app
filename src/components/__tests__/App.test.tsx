import { render } from "@/utils/rtl-wrapper";
import userEvent from "@testing-library/user-event";
import React from "react";
import { expect, it } from "vitest";

import App from "@/components/App";

it("can browse to the count page", () => {
  const { getByText, findByText } = render(<App />);
  expect(getByText("Welcome!")).toBeTruthy();
  userEvent.click(getByText("Go to count page"));
  expect(findByText("Count Page")).toBeTruthy();
});
