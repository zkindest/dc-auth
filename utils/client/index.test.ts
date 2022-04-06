import { extractPaths } from "."

test("extractPaths", () => {
  expect(
    extractPaths("http://localhost:3000/sdf/asdf/asdf?sdfj=sdfas&sdfdf=23&")
  ).toEqual(["sdf", "asdf", "asdf"])
  expect(
    extractPaths("http://localhost:3000/sdf//?sdfj=sdfas&sdfdf=23&")
  ).toEqual(["sdf"])
  expect(
    extractPaths("http://localhost:3000/sdf?sdfj=sdfas&sdfdf=23&")
  ).toEqual(["sdf"])
  expect(extractPaths("http://localhost/?sdfj=sdfas&sdfdf=23&")).toEqual([])
})
