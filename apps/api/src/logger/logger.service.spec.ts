import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import * as fs from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LoggerService } from './logger.service.js'

// Hoist mock object so it is available before node:console is imported
const { mockConsole } = vi.hoisted(() => ({
  mockConsole: {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

// Mock node:console using a constructor function for 'new Console()' compatibility
vi.mock('node:console', () => ({
  Console: vi.fn(function () {
    return mockConsole
  }),
}))

// Mock node:fs for ESM compatibility in Vitest
vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>()
  return {
    ...actual,
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
    appendFileSync: vi.fn(),
  }
})

describe('LoggerService', () => {
  let service: LoggerService

  beforeEach(async () => {
    vi.clearAllMocks()

    // Reset fs mocks
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.mkdirSync).mockImplementation(() => undefined as any)
    vi.mocked(fs.appendFileSync).mockImplementation(() => { })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((_key: string) => undefined),
          },
        },
      ],
    }).compile()

    service = await module.resolve<LoggerService>(LoggerService)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Console Logging', () => {
    it('should output log messages to console by default', () => {
      service.log('Test message')
      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('Test message'))
    })

    it('should route error logs to console.error', () => {
      service.error('Test error message')
      expect(mockConsole.error).toHaveBeenCalledWith(expect.stringContaining('Test error message'))
    })

    it('should route warn logs to console.warn', () => {
      service.warn('Test warn message')
      expect(mockConsole.warn).toHaveBeenCalledWith(expect.stringContaining('Test warn message'))
    })

    it('should route debug logs to console.debug', () => {
      service.debug('Test debug message')
      expect(mockConsole.debug).toHaveBeenCalledWith(expect.stringContaining('Test debug message'))
    })

    it('should disable console logs when LOG_DISABLED=true', async () => {
      const configMock = {
        get: vi.fn((key: string) => (key === 'LOG_DISABLED' ? 'true' : undefined)),
      }

      const module = await Test.createTestingModule({
        providers: [
          LoggerService,
          { provide: ConfigService, useValue: configMock },
        ],
      }).compile()

      const disabledLogger = await module.resolve<LoggerService>(LoggerService)
      disabledLogger.log('Disabled log')

      expect(mockConsole.log).not.toHaveBeenCalled()
    })
  })

  describe('File Logging & Independence', () => {
    it('should append logs to file when LOG_TO_FILE=true', async () => {
      const configMock = {
        get: vi.fn((key: string) => {
          if (key === 'LOG_TO_FILE') return 'true'
          if (key === 'LOG_FILE_PATH') return 'logs/test.log'
          return undefined
        }),
      }

      const module = await Test.createTestingModule({
        providers: [
          LoggerService,
          { provide: ConfigService, useValue: configMock },
        ],
      }).compile()

      const fileLogger = await module.resolve<LoggerService>(LoggerService)
      fileLogger.log('Log to file')

      expect(vi.mocked(fs.appendFileSync)).toHaveBeenCalledWith(
        expect.stringContaining('test.log'),
        expect.stringContaining('Log to file\n'),
        'utf8',
      )
    })

    it('should log to file independently even when console logging is disabled (LOG_DISABLED=true)', async () => {
      const configMock = {
        get: vi.fn((key: string) => {
          if (key === 'LOG_DISABLED') return 'true'
          if (key === 'LOG_TO_FILE') return 'true'
          return undefined
        }),
      }

      const module = await Test.createTestingModule({
        providers: [
          LoggerService,
          { provide: ConfigService, useValue: configMock },
        ],
      }).compile()

      const independentLogger = await module.resolve<LoggerService>(LoggerService)
      independentLogger.log('Independent file log')

      expect(mockConsole.log).not.toHaveBeenCalled()
      expect(vi.mocked(fs.appendFileSync)).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('Independent file log\n'),
        'utf8',
      )
    })

    it('should create log directory if it does not exist', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const configMock = {
        get: vi.fn((key: string) => {
          if (key === 'LOG_TO_FILE') return 'true'
          if (key === 'LOG_FILE_PATH') return 'custom_folder/app.log'
          return undefined
        }),
      }

      const module = await Test.createTestingModule({
        providers: [
          LoggerService,
          { provide: ConfigService, useValue: configMock },
        ],
      }).compile()

      const fileLogger = await module.resolve<LoggerService>(LoggerService)
      fileLogger.log('Directory creation test')

      expect(vi.mocked(fs.mkdirSync)).toHaveBeenCalledWith(expect.stringContaining('custom_folder'), { recursive: true })
      expect(vi.mocked(fs.appendFileSync)).toHaveBeenCalled()
    })
  })

  describe('Context & Static API', () => {
    it('should update context when setContext is called', () => {
      service.setContext('AuthModule')
      service.log('Authenticated user')

      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('[AuthModule]'))
    })

    it('should delegate static log methods to internal static instance', () => {
      LoggerService.log('Static logger test')
      expect(mockConsole.log).toHaveBeenCalledWith(expect.stringContaining('Static logger test'))
    })
  })
})