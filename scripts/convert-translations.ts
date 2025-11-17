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

// Generate the MessagesGroup structure for a nested object
function generateMessageGroupCode(
  obj: Record<string, unknown>,
  enObj: Record<string, unknown>,
  indent: string = "  "
): string {
  const entries: string[] = [];

  for (const key in obj) {
    const arValue = obj[key];
    const enValue = enObj?.[key];

    // Use quotes for keys with special characters or reserved words
    const needsQuotes = !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
    const keyStr = needsQuotes ? `"${key}"` : key;

    if (isObject(arValue)) {
      // Nested object - create a MessagesGroup
      const nestedCode = generateMessageGroupCode(
        arValue as Record<string, unknown>,
        enValue as Record<string, unknown>,
        indent + "  "
      );
      entries.push(
        `${indent}${keyStr}: new MessagesGroup({\n${nestedCode}\n${indent}})`
      );
    } else if (typeof arValue === "string" && typeof enValue === "string") {
      // Leaf node - create a message with _m()
      const enEscaped = enValue
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");
      const arEscaped = arValue
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
  arObj: Record<string, unknown>,
  enObj: Record<string, unknown>
): void {
  const dirName = toKebabCase(groupName);
  const varName = toCamelCase(dirName);
  const dirPath = path.join(groupsDir, dirName);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const messageGroupCode = generateMessageGroupCode(arObj, enObj);

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

// Process all top-level keys from ar.json
function convertAllTranslations(): void {
  console.log("Starting translation conversion...\n");

  // Skip 'common' and 'navigation' as they already exist
  const skipGroups: string[] = [];

  const groups: Array<{ key: string; varName: string; dirName: string }> = [];

  for (const key in arJson) {
    if (skipGroups.includes(key)) {
      console.log(`⊘ Skipping ${key} (already exists)`);
      continue;
    }

    const arObj = arJson[key];
    const enObj = enJson[key];

    if (isObject(arObj)) {
      const dirName = toKebabCase(key);
      const varName = toCamelCase(dirName);

      createGroupFile(key, arObj, enObj);
      groups.push({ key, varName, dirName });
    }
  }

  // Generate the structure.ts file
  generateStructureFile(groups);

  console.log("\n✓ Conversion complete!");
  console.log("\nNext step: Run validation to check for missing translations");
}

// Run the conversion
convertAllTranslations();
