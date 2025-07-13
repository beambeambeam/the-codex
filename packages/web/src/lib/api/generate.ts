import fs from "node:fs/promises";
import openapiTS, { astToString } from "openapi-typescript";
import ts from "typescript";

const FILE = ts.factory.createTypeReferenceNode(
  ts.factory.createIdentifier("File"),
);
const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull()); // `null`

async function generateType() {
  const ast = await openapiTS(new URL("http://localhost:8000/openapi.json"), {
    transform(schemaObject, _metadata) {
      if (schemaObject.format === "binary") {
        return schemaObject.nullable
          ? ts.factory.createUnionTypeNode([FILE, NULL])
          : FILE;
      }
      return undefined;
    },
  });
  const contents = astToString(ast);

  await fs.writeFile("./packages/web/src/lib/api/path.d.ts", contents);
}

generateType();
