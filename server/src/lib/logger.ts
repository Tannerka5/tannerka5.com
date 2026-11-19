type LogMetadata = Record<string, unknown>;

// Never pass Authorization headers, tokens, or passwords in `metadata` —
// this is the one place a leak reaches CloudWatch for every invocation.
function log(level: 'debug' | 'info' | 'error', message: string, metadata?: LogMetadata): void {
  const entry = metadata ? { level, message, ...metadata } : { level, message };
  const serialized = JSON.stringify(entry);
  if (level === 'error') {
    console.error(serialized);
  } else {
    console.log(serialized);
  }
}

export const logger = {
  debug: (message: string, metadata?: LogMetadata): void => log('debug', message, metadata),
  info: (message: string, metadata?: LogMetadata): void => log('info', message, metadata),
  error: (message: string, metadata?: LogMetadata): void => log('error', message, metadata),
};
