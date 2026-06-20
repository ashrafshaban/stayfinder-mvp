import { describe, it, expect } from "vitest";
import { formatScore, formatPrice, buildQueryString } from "./client";

describe("client utilities", () => {
  it("formatScore returns percentage label", () => {
    expect(formatScore(89)).toBe("89% Match");
  });

  it("formatPrice formats USD", () => {
    expect(formatPrice(150)).toMatch(/\$150/);
  });

  it("buildQueryString omits empty values", () => {
    expect(buildQueryString({ destination: "Cairo", budget: undefined })).toBe("?destination=Cairo");
  });
});
