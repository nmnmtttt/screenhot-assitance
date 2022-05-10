export interface Options {
  filename?: string
  extra?: any
  content?: any
  route?: string
  origin?: string
  copy?: any
  permissions?: string[]
  images?: string
  version?: any
  merge?: any
  jumpBackground?: any
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.less' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}
declare class MergeManifest {
  private readonly extra
  private readonly content
  private readonly filename
  private readonly route
  private readonly origin
  private readonly copy
  private readonly images
  private merge
  private manifest
  private permissions
  private version
  private jumpBackground
  private options
  constructor(options: Options)
  apply(compiler: any): void
  handleInit(compilation: any): void
  extraFunctionLoad(title: string): void
  backgroundInit(entryFiles: any, title?: string): boolean
  contentInit(entryFiles: any, title?: string): void
  devtoolInit(title?: string): void
  iframeInit(entryFiles: any, title?: string): void
  injectInit(entryFiles: any, title?: string): void
  permissionsInit(entryFiles: any, title?: string): void
  versionInit(): void
  findPush(entryFiles: any, location: any, verify?: boolean, props?: any): any
  typeToSource(location: any): void
}
export { MergeManifest }
