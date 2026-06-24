import { describe, it, expect } from "vitest";
import { formatScore, formatPrice } from "../utils/format";
import { buildQueryString } from "../api/http/client";

describe("format utilities", () => {
  it("formatScore returns percentage label", () => {
    expect(formatScore(89)).toBe("89% Match");
  });

  it("formatPrice formats USD", () => {
    expect(formatPrice(150)).toMatch(/\$150/);
  });
});

describe("http client utilities", () => {
  it("buildQueryString omits empty values", () => {
    expect(buildQueryString({ destination: "Cairo", budget: undefined })).toBe("?destination=Cairo");
  });
});
