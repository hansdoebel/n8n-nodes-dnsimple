#!/usr/bin/env bun
/**
 * Validates that the release is ready for publishing.
 * Run this before pushing a version tag.
 *
 * Usage: bun run scripts/validate-release.ts [version]
 *
 * If version is provided, it validates that package.json matches.
 * Example: bun run scripts/validate-release.ts 1.0.0
 */

import { existsSync, readFileSync } from "fs";
import { execSync } from "child_process";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

function log(message: string, color = RESET) {
	console.log(`${color}${message}${RESET}`);
}

function success(message: string) {
	log(`✓ ${message}`, GREEN);
}

function error(message: string) {
	log(`✗ ${message}`, RED);
}

function warn(message: string) {
	log(`⚠ ${message}`, YELLOW);
}

function run(
	command: string,
	silent = false,
): { success: boolean; output: string } {
	try {
		const output = execSync(command, {
			encoding: "utf-8",
			stdio: silent ? "pipe" : "inherit",
		});
		return { success: true, output: output || "" };
	} catch (e) {
		const err = e as { stdout?: string; stderr?: string };
		return { success: false, output: err.stdout || err.stderr || "" };
	}
}

async function main() {
	const args = process.argv.slice(2);
	const expectedVersion = args[0];
	let hasErrors = false;

	log("\n🔍 Validating release...\n");

	// 1. Check package.json exists and is valid
	const packageJsonPath = "package.json";
	if (!existsSync(packageJsonPath)) {
		error("package.json not found");
		process.exit(1);
	}

	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	const currentVersion = packageJson.version;

	success(`Found package.json with version ${currentVersion}`);

	// 2. Validate version format
	const versionRegex = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
	if (!versionRegex.test(currentVersion)) {
		error(`Invalid version format: ${currentVersion}`);
		hasErrors = true;
	} else {
		success("Version format is valid");
	}

	// 3. Check if expected version matches (if provided)
	if (expectedVersion) {
		const normalizedExpected = expectedVersion.replace(/^v/, "");
		if (currentVersion !== normalizedExpected) {
			error(
				`Version mismatch: package.json has ${currentVersion}, expected ${normalizedExpected}`,
			);
			hasErrors = true;
		} else {
			success(`Version matches expected: ${normalizedExpected}`);
		}
	}

	// 4. Check required fields
	const requiredFields = [
		"name",
		"version",
		"description",
		"license",
		"author",
		"repository",
	];
	for (const field of requiredFields) {
		if (!packageJson[field]) {
			error(`Missing required field: ${field}`);
			hasErrors = true;
		}
	}
	success("All required fields present");

	// 5. Check n8n configuration
	if (!packageJson.n8n) {
		error("Missing n8n configuration");
		hasErrors = true;
	} else {
		if (!packageJson.n8n.nodes || packageJson.n8n.nodes.length === 0) {
			error("No nodes defined in n8n configuration");
			hasErrors = true;
		}
		if (
			!packageJson.n8n.credentials || packageJson.n8n.credentials.length === 0
		) {
			error("No credentials defined in n8n configuration");
			hasErrors = true;
		}
		success("n8n configuration is valid");
	}

	// 6. Run build
	log("\n📦 Building...\n");
	const buildResult = run("bun run build");
	if (!buildResult.success) {
		error("Build failed");
		hasErrors = true;
	} else {
		success("Build succeeded");
	}

	// 7. Check dist files exist
	const distFiles = [
		"dist/nodes/DNSimple/Dnsimple.node.js",
		"dist/credentials/DNSimpleApi.credentials.js",
	];
	for (const file of distFiles) {
		if (!existsSync(file)) {
			error(`Missing dist file: ${file}`);
			hasErrors = true;
		}
	}
	success("All dist files present");

	// 8. Run lint
	log("\n🔎 Linting...\n");
	const lintResult = run("bun run lint", true);
	if (!lintResult.success) {
		error("Lint failed");
		hasErrors = true;
	} else {
		success("Lint passed");
	}

	// 9. Run tests
	log("\n🧪 Running tests...\n");
	const testResult = run("bun run test", true);
	if (!testResult.success) {
		error("Tests failed");
		hasErrors = true;
	} else {
		success("Tests passed");
	}

	// 10. Check for uncommitted changes
	log("\n📋 Checking git status...\n");
	const gitStatus = run("git status --porcelain", true);
	if (gitStatus.output.trim()) {
		warn("You have uncommitted changes:");
		console.log(gitStatus.output);
	} else {
		success("Working directory is clean");
	}

	// Summary
	log("\n" + "=".repeat(50) + "\n");
	if (hasErrors) {
		error("Release validation FAILED");
		log("\nPlease fix the errors above before publishing.\n");
		process.exit(1);
	} else {
		success("Release validation PASSED");
		log(`\nReady to publish version ${currentVersion}!\n`);
		log("To publish, run:");
		log(`  git tag v${currentVersion}`);
		log(`  git push origin v${currentVersion}\n`);
	}
}

main().catch((e) => {
	error(`Unexpected error: ${e}`);
	process.exit(1);
});
