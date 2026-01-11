import { API_DELAY, delay } from "./config";

export async function withDelay<T>(fn: () => Promise<T>): Promise<T> {
	const result = await fn();
	await delay(API_DELAY);
	return result;
}

export function generateUniqueName(prefix: string): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 6);
	return `${prefix}-${timestamp}-${random}`;
}

export function generateTestDomainName(): string {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 6);
	return `test-${timestamp}-${random}.com`;
}

export function generateTestEmail(): string {
	const timestamp = Date.now();
	return `test-${timestamp}@example.com`;
}

export function generateTestUrl(): string {
	const timestamp = Date.now();
	return `https://webhook-${timestamp}.example.com/callback`;
}

export interface CleanupFn {
	(): Promise<void>;
}

export class CleanupManager {
	private cleanupFns: CleanupFn[] = [];

	register(fn: CleanupFn): void {
		this.cleanupFns.unshift(fn);
	}

	async runAll(): Promise<void> {
		for (const fn of this.cleanupFns) {
			try {
				await fn();
				await delay(API_DELAY);
			} catch (error) {
				console.warn("Cleanup failed:", error);
			}
		}
		this.cleanupFns = [];
	}
}
