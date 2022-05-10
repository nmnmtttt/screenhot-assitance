import { join } from 'path'
export const SCRIPT_EXTENSISONS = ['.js', '.jsx', '.ts', '.tsx']

export const STYLE_EXTENSISONS = ['.less', '.css', '.scss']

export const CWD = process.cwd()

export const EXAMPLE_TEMPLATE_PATH = join(CWD, 'src')
