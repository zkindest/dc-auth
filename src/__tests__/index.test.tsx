// import { render, screen } from "@testing-library/react"
import { render, screen } from "../test-utils"
import Home from "~/pages/index"

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />)

    const heading = screen.getByRole("heading", {
      name: /Join thousands of learners from around the world/i,
    })

    expect(heading).toMatchSnapshot()
    expect(heading).toBeInTheDocument()
  })
})
