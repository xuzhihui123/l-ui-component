import { outDir, projRoot, luiRoot } from "./utils/path"
import glob from "fast-glob"
import { Project, ModuleKind, ScriptTarget, SourceFile } from "ts-morph"
import path from "path"
import fs from "fs/promises"
import { parallel, series, src, dest } from "gulp"
import { buildConfig } from "./utils/config"

export const genEntryTypes = async () => {
  const files = await glob("*.ts", {
    cwd: luiRoot,
    absolute: true,
    onlyFiles: true
  })
  const project = new Project({
    compilerOptions: {
      declaration: true,
      module: ModuleKind.ESNext,
      allowJs: true,
      emitDeclarationOnly: true,
      noEmitOnError: false,
      outDir: path.resolve(outDir, "entry/types"),
      target: ScriptTarget.ESNext,
      rootDir: luiRoot,
      strict: false
    },
    skipFileDependencyResolution: true,
    tsConfigFilePath: path.resolve(projRoot, "tsconfig.json"),
    skipAddingFilesFromTsConfig: true
  })
  const sourceFiles: SourceFile[] = []
  files.map((f) => {
    const sourceFile = project.addSourceFileAtPath(f)
    sourceFiles.push(sourceFile)
  })
  await project.emit({
    emitOnlyDtsFiles: true
  })
  const tasks = sourceFiles.map(async (sourceFile) => {
    const emitOutput = sourceFile.getEmitOutput()
    for (const outputFile of emitOutput.getOutputFiles()) {
      const filepath = outputFile.getFilePath()
      await fs.mkdir(path.dirname(filepath), { recursive: true })
      await fs.writeFile(filepath, outputFile.getText().replaceAll("@l-ui", "."), "utf8")
    }
  })
  await Promise.all(tasks)
}
export const copyEntryTypes = () => {
  const copy = (module) => async () => {
    const output = path.resolve(outDir, buildConfig[module].output.path)
    return src(path.resolve(outDir, "entry/types/**")).pipe(dest(output))
  }
  return parallel(copy("esm"), copy("cjs"))
}

export const genTypes = series(genEntryTypes, copyEntryTypes())
