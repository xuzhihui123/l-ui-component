export const externalFn = (regexp: string[] | string) => {
  if (Array.isArray(regexp)) {
    return (id: string) => new RegExp(regexp.map((r) => `(^${r})`).join("|")).test(id) // 打包的时候不打包vue代码
  } else {
    return (id: string) => new RegExp(regexp).test(id)
  }
}

export function formatBundleFilename(name: string, minify: boolean, ext: string) {
  return `${name}${minify ? ".min" : ""}.${ext}`
}
