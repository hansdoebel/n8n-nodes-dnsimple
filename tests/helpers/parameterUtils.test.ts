import { describe, expect, test } from "bun:test";
import { resolveResourceLocator } from "../../nodes/DNSimple/helpers/parameterUtils";

describe("parameterUtils", () => {
	describe("resolveResourceLocator", () => {
		test("extracts value from object form", () => {
			const mockContext = {
				getNodeParameter: () => ({ mode: "list", value: "example.com" }),
			} as any;
			const result = resolveResourceLocator(mockContext, "domainId", 0);
			expect(result).toBe("example.com");
		});

		test("returns plain string directly", () => {
			const mockContext = {
				getNodeParameter: () => "example.com",
			} as any;
			const result = resolveResourceLocator(mockContext, "domainId", 0);
			expect(result).toBe("example.com");
		});

		test("passes correct paramName and index", () => {
			let capturedName: string;
			let capturedIndex: number;
			const mockContext = {
				getNodeParameter: (name: string, index: number) => {
					capturedName = name;
					capturedIndex = index;
					return "test";
				},
			} as any;
			resolveResourceLocator(mockContext, "zoneId", 5);
			expect(capturedName!).toBe("zoneId");
			expect(capturedIndex!).toBe(5);
		});
	});
});
