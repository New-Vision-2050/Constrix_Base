import * as fs from "fs";
import * as path from "path";

// Read JSON files
const enJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../messages/en.json"), "utf-8")
);
const arJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../messages/ar.json"), "utf-8")
);

const groupsDir = path.join(__dirname, "../messages/groups");

// Track missing translations
const missingTranslations: {
  ar: Array<{ path: string; enText: string }>;
  en: Array<{ path: string; arText: string }>;
} = {
  ar: [],
  en: [],
};

// Helper to convert camelCase or PascalCase to kebab-case
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

// Helper to convert kebab-case to camelCase for variable names
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Helper to check if a value is an object (not array, not null)
function isObject(value: unknown): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Deep merge translations from both JSON files
// Creates a unified structure with both en and ar translations
function mergeTranslations(
  enData: Record<string, unknown>,
  arData: Record<string, unknown>
): Record<
  string,
  { en: Record<string, unknown>; ar: Record<string, unknown> }
> {
  const merged: Record<
    string,
    { en: Record<string, unknown>; ar: Record<string, unknown> }
  > = {};
  const allKeys = new Set([...Object.keys(enData), ...Object.keys(arData)]);

  for (const key of allKeys) {
    const enValue = enData[key];
    const arValue = arData[key];

    // Get the values, defaulting to empty objects if not present
    const enObj = isObject(enValue) ? (enValue as Record<string, unknown>) : {};
    const arObj = isObject(arValue) ? (arValue as Record<string, unknown>) : {};

    merged[key] = { en: enObj, ar: arObj };
  }

  return merged;
}

// Generate the MessagesGroup structure for a nested object
function generateMessageGroupCode(
  enObj: Record<string, unknown>,
  arObj: Record<string, unknown>,
  indent: string = "  ",
  parentPath: string = ""
): string {
  const entries: string[] = [];

  // Merge keys from both objects to ensure we don't miss any
  const mergedKeys = new Set([...Object.keys(enObj), ...Object.keys(arObj)]);

  for (const key of mergedKeys) {
    const enValue = enObj[key];
    const arValue = arObj[key];

    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    // Use quotes for keys with special characters or reserved words
    const needsQuotes = !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
    const keyStr = needsQuotes ? `"${key}"` : key;

    if (isObject(enValue) || isObject(arValue)) {
      // At least one is an object - create a MessagesGroup
      const enNested = isObject(enValue)
        ? (enValue as Record<string, unknown>)
        : {};
      const arNested = isObject(arValue)
        ? (arValue as Record<string, unknown>)
        : {};

      const nestedCode = generateMessageGroupCode(
        enNested,
        arNested,
        indent + "  ",
        currentPath
      );
      entries.push(
        `${indent}${keyStr}: new MessagesGroup({\n${nestedCode}\n${indent}})`
      );
    } else {
      // Both are primitives (strings) - create a message with _m()
      const enString = typeof enValue === "string" ? enValue : "";
      const arString = typeof arValue === "string" ? arValue : "";

      // Track missing translations
      if (enString && !arString) {
        missingTranslations.ar.push({ path: currentPath, enText: enString });
      }
      if (arString && !enString) {
        missingTranslations.en.push({ path: currentPath, arText: arString });
      }

      const enEscaped = enString
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");
      const arEscaped = arString
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");

      entries.push(`${indent}${keyStr}: _m("${enEscaped}", "${arEscaped}")`);
    }
  }

  return entries.join(",\n");
}

// Create a group file
function createGroupFile(
  groupName: string,
  enObj: Record<string, unknown>,
  arObj: Record<string, unknown>
): void {
  const dirName = toKebabCase(groupName);
  const varName = toCamelCase(dirName);
  const dirPath = path.join(groupsDir, dirName);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const messageGroupCode = generateMessageGroupCode(enObj, arObj);

  const fileContent = `import { _m, MessagesGroup } from "../../types";

export const ${varName}Messages = new MessagesGroup({
${messageGroupCode}
});
`;

  const filePath = path.join(dirPath, "index.ts");
  fs.writeFileSync(filePath, fileContent, "utf-8");
  console.log(`✓ Created ${dirName}/index.ts`);
}

// Generate the structure.ts file with all imports
function generateStructureFile(
  groups: Array<{ key: string; varName: string; dirName: string }>
): void {
  const imports = groups
    .map(
      ({ varName, dirName }) =>
        `import { ${varName}Messages } from "./groups/${dirName}";`
    )
    .join("\n");

  const structureEntries = groups
    .map(({ key, varName }) => {
      // Use quotes for keys with special characters
      const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      return `  ${keyStr}: ${varName}Messages`;
    })
    .join(",\n");

  const fileContent = `import { MessagesGroup } from "./types";
${imports}

// Main messages structure combining all groups
export const messagesStructure = new MessagesGroup({
${structureEntries},
});
`;

  const filePath = path.join(__dirname, "../messages/structure.ts");
  fs.writeFileSync(filePath, fileContent, "utf-8");
  console.log("\n✓ Generated structure.ts");
}

// Process all top-level keys from both JSON files
function convertAllTranslations(): void {
  console.log("Starting translation conversion...\n");

  // Step 1: Merge translations from both JSON files
  console.log("Step 1: Merging translations from en.json and ar.json...");
  const mergedTranslations = mergeTranslations(enJson, arJson);
  console.log(
    `✓ Merged ${Object.keys(mergedTranslations).length} unique groups\n`
  );

  const skipGroups: string[] = [];
  const groups: Array<{ key: string; varName: string; dirName: string }> = [];

  // Step 2: Convert merged object to directory structure
  console.log("Step 2: Generating message group files...\n");

  for (const [key, { en, ar }] of Object.entries(mergedTranslations)) {
    if (skipGroups.includes(key)) {
      console.log(`⊘ Skipping ${key} (in skip list)`);
      continue;
    }

    const dirName = toKebabCase(key);
    const varName = toCamelCase(dirName);

    createGroupFile(key, en, ar);
    groups.push({ key, varName, dirName });
  }

  // Step 3: Generate the structure.ts file
  console.log("\nStep 3: Generating structure.ts...");
  generateStructureFile(groups);

  console.log("\n✓ Conversion complete!");
  console.log(
    "\nAll translations from both JSON files have been merged and converted."
  );

  // Write missing translations report
  writeMissingTranslationsReport();
}

// Write missing translations to a text file
function writeMissingTranslationsReport(): void {
  const reportLines: string[] = [];

  if (
    missingTranslations.ar.length === 0 &&
    missingTranslations.en.length === 0
  ) {
    console.log("\n✓ No missing translations found!");
    return;
  }

  reportLines.push("MISSING TRANSLATIONS REPORT");
  reportLines.push("==========================");
  reportLines.push(`Generated: ${new Date().toISOString()}`);
  reportLines.push("");

  if (missingTranslations.ar.length > 0) {
    reportLines.push("MISSING ARABIC TRANSLATIONS:");
    reportLines.push("----------------------------");
    reportLines.push(`Total: ${missingTranslations.ar.length}`);
    reportLines.push("");

    for (const { path, enText } of missingTranslations.ar) {
      reportLines.push(`${path}: "${enText}"`);
    }
    reportLines.push("");
  }

  if (missingTranslations.en.length > 0) {
    reportLines.push("MISSING ENGLISH TRANSLATIONS:");
    reportLines.push("-----------------------------");
    reportLines.push(`Total: ${missingTranslations.en.length}`);
    reportLines.push("");

    for (const { path, arText } of missingTranslations.en) {
      reportLines.push(`${path}: "${arText}"`);
    }
    reportLines.push("");
  }

  const reportPath = path.join(__dirname, "../missing-translations.txt");
  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf-8");

  console.log(
    `\n⚠ Found ${missingTranslations.ar.length} missing AR and ${missingTranslations.en.length} missing EN translations`
  );
  console.log(`📄 Report saved to: missing-translations.txt`);
}

// Run the conversion
convertAllTranslations();
