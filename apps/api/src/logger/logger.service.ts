import { Injectable, Optional, LoggerService as NestLoggerService, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Console } from 'node:console'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as process from 'node:process'

// Dedicated Console Instance
const customConsole = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
})

// --- Interfaces & Types ---
export type LogLevel = 'log' | 'info' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal'
export type LogContext = string | (new (...args: any[]) => unknown) | object | null

export interface LoggerOptions {
  context?: LogContext
  timestampFormat?: 'iso' | 'locale' | 'time'
  logToConsole?: boolean
  logToFile?: boolean
  logFilePath?: string
  prefix?: string
  logLevels?: LogLevel[]
}

export type ColorKey =
  | 'reset' | 'bold' | 'dim' | 'italic' | 'underline'
  | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray'
  | 'brightRed' | 'brightGreen' | 'brightYellow' | 'brightBlue' | 'brightMagenta' | 'brightCyan' | 'brightWhite'

// --- Color Utilities ---
export const colors: Record<ColorKey, string> = {
  reset: '\x1B[0m',
  bold: '\x1B[1m',
  dim: '\x1B[2m',
  italic: '\x1B[3m',
  underline: '\x1B[4m',

  red: '\x1B[31m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  white: '\x1B[37m',
  gray: '\x1B[90m',

  brightRed: '\x1B[91m',
  brightGreen: '\x1B[92m',
  brightYellow: '\x1B[93m',
  brightBlue: '\x1B[94m',
  brightMagenta: '\x1B[95m',
  brightCyan: '\x1B[96m',
  brightWhite: '\x1B[97m',
}

export function colorize(color: ColorKey, text: string | number | boolean): string {
  return `${colors[color]}${String(text)}${colors.reset}`
}

export function style(styles: ColorKey[], text: string | number | boolean): string {
  const prefix = styles.map(s => colors[s]).join('')
  return `${prefix}${String(text)}${colors.reset}`
}

export function stripAnsi(text: string): string {
  return text.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
}

// --- Data Formatter ---
export function formatData(value: unknown, depth = 0): string {
  const indent = '  '.repeat(depth)

  if (typeof value === 'string')
    return colorize('green', `'${value}'`)
  if (typeof value === 'number')
    return colorize('yellow', value)
  if (typeof value === 'boolean')
    return colorize('brightMagenta', value)
  if (value === null)
    return colorize('gray', 'null')
  if (value === undefined)
    return colorize('gray', 'undefined')

  const braceOpen = colorize('gray', '{')
  const braceClose = colorize('gray', '}')
  const bracketOpen = colorize('gray', '[')
  const bracketClose = colorize('gray', ']')
  const comma = colorize('gray', ',')
  const colon = colorize('gray', ':')

  if (Array.isArray(value)) {
    if (value.length === 0)
      return `${bracketOpen}${bracketClose}`
    const inner = value
      .map(v => `${indent}  ${formatData(v, depth + 1)}`)
      .join(`${comma}\n`)
    return `${bracketOpen}\n${inner}\n${indent}${bracketClose}`
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>)
    if (keys.length === 0)
      return `${braceOpen}${braceClose}`
    const inner = keys
      .map((k) => {
        const keyStr = style(['brightCyan'], k)
        const valStr = formatData((value as Record<string, unknown>)[k], depth + 1)
        return `${indent}  ${keyStr}${colon} ${valStr}`
      })
      .join(`${comma}\n`)
    return `${braceOpen}\n${inner}\n${indent}${bracketClose}`
  }

  return String(value)
}

// --- Context Helper ---
export function resolveContext(context?: LogContext, fallback = 'Application'): string {
  if (!context)
    return fallback
  if (typeof context === 'string')
    return context
  if (typeof context === 'function')
    return context.name || fallback
  if (typeof context === 'object') {
    return context.constructor?.name || fallback
  }
  return fallback
}

// --- Level Themes & Syntax Highlighter ---
interface LevelTheme {
  label: string
  badgeColor: ColorKey
  prefixColor: ColorKey
  defaultMsgColor: ColorKey
}

const LEVEL_THEMES: Record<LogLevel, LevelTheme> = {
  log: { label: 'LOG', badgeColor: 'brightGreen', prefixColor: 'green', defaultMsgColor: 'green' },
  info: { label: 'INFO', badgeColor: 'brightBlue', prefixColor: 'blue', defaultMsgColor: 'brightWhite' },
  error: { label: 'ERROR', badgeColor: 'brightRed', prefixColor: 'red', defaultMsgColor: 'brightRed' },
  warn: { label: 'WARN', badgeColor: 'brightYellow', prefixColor: 'yellow', defaultMsgColor: 'brightYellow' },
  debug: { label: 'DEBUG', badgeColor: 'brightMagenta', prefixColor: 'magenta', defaultMsgColor: 'brightMagenta' },
  verbose: { label: 'VERBOSE', badgeColor: 'brightCyan', prefixColor: 'cyan', defaultMsgColor: 'cyan' },
  fatal: { label: 'FATAL', badgeColor: 'brightRed', prefixColor: 'red', defaultMsgColor: 'brightRed' },
}

function highlightMessage(text: string, defaultColor: ColorKey): string {
  let result = text.replace(/(https?:\/\/\S+)/g, url => style(['underline', 'brightCyan'], url))
  result = result.replace(/\b(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\b/g, method => style(['bold', 'brightYellow'], method))
  result = result.replace(/(\/[\w\-~]+(?:\/[\w\-~]*)*)/g, route => style(['bold', 'brightMagenta'], route))
  result = result.replace(/(["'])(?:\\.|[^\\])*?\1/g, str => colorize('brightGreen', str))
  result = result.replace(/\b(\d+)\b/g, num => colorize('yellow', num))
  return colorize(defaultColor, result)
}

const DEFAULT_LOG_LEVELS: LogLevel[] = ['log', 'info', 'error', 'warn', 'debug', 'verbose', 'fatal']

// --- NestJS Logger Service ---
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private static globalContext: LogContext = 'Application'
  private static globalOptions: LoggerOptions = {}
  private static staticInstance: LoggerService
  private static pid = process.pid

  protected context: string
  protected options: LoggerOptions
  private configService?: ConfigService

  constructor(
    @Optional() contextOrConfig?: LogContext | ConfigService,
    @Optional() options: LoggerOptions = {},
    @Optional() configService?: ConfigService,
  ) {
    let context: LogContext | undefined

    if (contextOrConfig && typeof contextOrConfig === 'object' && 'get' in contextOrConfig && typeof (contextOrConfig as any).get === 'function') {
      this.configService = contextOrConfig as ConfigService
    }
    else {
      context = contextOrConfig as LogContext
      this.configService = configService
    }

    // Terminal Logging Toggle (Default: true)
    const envConsoleDisabled
      = this.getEnv('LOG_DISABLED') === 'true'
      || this.getEnv('LOG_CONSOLE_ENABLE') === 'false'
      || this.getEnv('LOG_TO_CONSOLE') === 'false'
    const envConsole = !envConsoleDisabled

    // File Logging Toggle (Default: false)
    const envToFile
      = this.getEnv('LOG_TO_FILE') === 'true'
      || this.getEnv('LOG_FILE_ENABLE') === 'true'
    const envFilePath = this.getEnv('LOG_FILE_PATH') ?? 'logs/app.log'

    const envPrefix = this.getEnv('LOG_PREFIX')
    const rawLogLevels = this.getEnv('LOG_LEVELS')
    const envLevels = rawLogLevels
      ? (rawLogLevels.split(',').map(l => l.trim()) as LogLevel[])
      : undefined

    this.options = {
      timestampFormat: 'locale',
      logToConsole: envConsole,
      logToFile: envToFile,
      logFilePath: envFilePath,
      prefix: envPrefix ?? 'App',
      logLevels: envLevels ?? DEFAULT_LOG_LEVELS,
      ...LoggerService.globalOptions,
      ...options,
    }

    this.context = resolveContext(context, resolveContext(LoggerService.globalContext))

    if (!LoggerService.staticInstance) {
      LoggerService.staticInstance = this
    }
  }

  private getEnv(key: string): string | undefined {
    if (this.configService) {
      const val = this.configService.get<string>(key)
      if (val !== undefined && val !== null)
        return String(val)
    }
    return process.env[key]
  }

  // --- NestJS API & Configuration ---
  public setContext(context: LogContext) {
    this.context = resolveContext(context)
  }

  public setLogLevels(levels: LogLevel[]) {
    this.options.logLevels = levels
  }

  static setGlobalOptions(options: LoggerOptions) {
    this.globalOptions = options
  }

  static setGlobalContext(context: LogContext) {
    this.globalContext = context
    if (this.staticInstance) {
      this.staticInstance.context = resolveContext(context)
    }
  }

  // --- Static Helper Methods ---
  static log(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.getStaticInstance().log(message, context, ...optionalParams)
  }

  static info(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.getStaticInstance().info(message, context, ...optionalParams)
  }

  static error(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.getStaticInstance().error(message, context, ...optionalParams)
  }

  static warn(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.getStaticInstance().warn(message, context, ...optionalParams)
  }

  static debug(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.getStaticInstance().debug(message, context, ...optionalParams)
  }

  static verbose(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.getStaticInstance().verbose(message, context, ...optionalParams)
  }

  static fatal(message: unknown, context?: LogContext, ...optionalParams: unknown[]) {
    this.getStaticInstance().fatal(message, context, ...optionalParams)
  }

  private static getStaticInstance(): LoggerService {
    if (!this.staticInstance) {
      this.staticInstance = new LoggerService()
    }
    return this.staticInstance
  }

  // --- Instance Methods ---
  log(message: unknown, ...optionalParams: unknown[]) {
    this.print('log', message, optionalParams)
  }

  info(message: unknown, ...optionalParams: unknown[]) {
    this.print('info', message, optionalParams)
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.print('error', message, optionalParams)
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.print('warn', message, optionalParams)
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.print('debug', message, optionalParams)
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.print('verbose', message, optionalParams)
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    this.print('fatal', message, optionalParams)
  }

  // --- Formatting and Output ---
  private isLevelEnabled(level: LogLevel): boolean {
    const levels = this.options.logLevels ?? DEFAULT_LOG_LEVELS

    if (level === 'log' && levels.includes('info'))
      return true
    if (level === 'info' && levels.includes('log'))
      return true

    return levels.includes(level)
  }

  private parseContextAndParams(optionalParams: unknown[]): { activeContext: string, params: unknown[] } {
    let activeContext = this.context
    const params = [...optionalParams]

    if (params.length > 0) {
      const last = params[params.length - 1]
      if (typeof last === 'string') {
        if (!last.includes('\n') && !last.includes('    at ')) {
          activeContext = resolveContext(last, this.context)
          params.pop()
        }
      }
      else if (typeof last === 'function' || (typeof last === 'object' && last !== null && !Array.isArray(last) && last.constructor?.name !== 'Object')) {
        activeContext = resolveContext(last as LogContext, this.context)
        params.pop()
      }
    }

    return { activeContext, params }
  }

  private print(level: LogLevel, message: unknown, optionalParams: unknown[]) {
    if (!this.isLevelEnabled(level))
      return

    if (!this.options.logToConsole && !this.options.logToFile)
      return

    const { activeContext, params } = this.parseContextAndParams(optionalParams)

    const formattedMsg = this.formatMessage(
      level,
      message,
      activeContext,
      this.options,
      LoggerService.pid,
      params,
    )

    if (this.options.logToConsole) {
      switch (level) {
        case 'error':
        case 'fatal':
          customConsole.error(formattedMsg)
          break
        case 'warn':
          customConsole.warn(formattedMsg)
          break
        case 'debug':
          customConsole.debug(formattedMsg)
          break
        default:
          customConsole.log(formattedMsg)
          break
      }
    }

    if (this.options.logToFile && this.options.logFilePath) {
      this.writeToFile(formattedMsg)
    }
  }

  private writeToFile(formattedMsg: string) {
    try {
      const cleanMsg = stripAnsi(formattedMsg)
      const filePath = path.resolve(this.options.logFilePath!)
      const dir = path.dirname(filePath)

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.appendFileSync(filePath, `${cleanMsg}\n`, 'utf8')
    }
    catch (err) {
      customConsole.error(`[LoggerService] Failed writing log to file: ${err}`)
    }
  }

  private formatMessage(
    level: LogLevel,
    message: unknown,
    context: string,
    options: LoggerOptions,
    pid: string | number,
    optionalParams: unknown[],
  ): string {
    const now = new Date()
    let timestamp = now.toLocaleString()
    if (options.timestampFormat === 'iso')
      timestamp = now.toISOString()
    if (options.timestampFormat === 'time')
      timestamp = now.toLocaleTimeString()

    const envPrefix = this.getEnv('LOG_PREFIX')
    const prefix = options.prefix ?? envPrefix ?? 'App'

    const theme = LEVEL_THEMES[level] ?? LEVEL_THEMES.log

    const prefixBracket = colorize(theme.prefixColor, `[${prefix}]`)
    const pidFormatted = colorize('brightGreen', pid)
    const pidStr = `${prefixBracket} ${pidFormatted}  - `

    const timeStr = colorize('gray', timestamp)
    const levelBadge = style(['bold', theme.badgeColor], theme.label.padEnd(7, ' '))
    const contextStr = colorize('brightYellow', `[${context}]`)

    const formattedMessage
      = typeof message === 'string'
        ? highlightMessage(message, theme.defaultMsgColor)
        : `\n${formatData(message)}`

    const formattedParams = optionalParams.length
      ? `\n${optionalParams.map(p => (typeof p === 'string' ? p : formatData(p))).join('\n')}`
      : ''

    return `${pidStr}${timeStr}     ${levelBadge}${contextStr} ${formattedMessage}${formattedParams}`
  }
}