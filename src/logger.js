import pino from 'pino';

const send = async (level, logEvent) => {
  console.log('[PINO LOG]', logEvent);
};

const logger = pino({
  level: 'info',
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
      send,
    },
  },
});

export default logger;