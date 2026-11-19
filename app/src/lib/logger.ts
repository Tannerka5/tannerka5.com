const isDev = import.meta.env.DEV;

export const debugLog = (...args: unknown[]) => {
    if (isDev) console.log(...args);
};

export const debugWarn = (...args: unknown[]) => {
    if (isDev) console.warn(...args);
};
