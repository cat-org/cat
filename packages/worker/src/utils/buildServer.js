// @flow

import net from 'net';
import stream from 'stream';

import debug from 'debug';

const debugLog = debug('worker:buildServer');

/**
 * @example
 * buildServer(8000)
 *
 * @param {number} port - the port of the server
 *
 * @return {object} - net server
 */
export default (port: number): net$Server => {
  const cache = {};
  let timer: TimeoutID;

  const server = net
    .createServer((socket: net.Socket) => {
      socket.setEncoding('utf8').on('data', async (data: string) => {
        const { type, filePath, argv, hasStdout } = JSON.parse(data);

        debugLog(data);

        try {
          if (type === 'end') {
            timer = setTimeout(() => {
              if (Object.keys(cache).length !== 0) return;

              debugLog('Close server');
              clearTimeout(timer);
              server.close();
            }, 5000);

            delete cache[filePath];
            delete require.cache[filePath];
            socket.end('end;');
            return;
          }

          if (!cache[filePath])
            // $FlowFixMe The parameter passed to require must be a string literal.
            cache[filePath] = require(filePath);

          clearTimeout(timer);
          debugLog(cache);

          if (type === 'start') {
            socket.write('start;');
            socket.end(JSON.stringify(Object.keys(cache[filePath])));
            return;
          }

          if (hasStdout) {
            socket.write('stdout;');
            argv[0] = new stream.Writable({
              write: (chunk: Buffer | string) => {
                socket.write(chunk);
              },
            });
          }

          const serverData = JSON.stringify(
            await cache[filePath][type](...argv),
          );

          debugLog(serverData);
          socket.write('normal;');
          socket.end(serverData);
        } catch (e) {
          debugLog(e);
          socket.write('error;');
          socket.end(
            JSON.stringify({
              message: e.message,
              stack: e.stack,
            }),
          );
        }
      });
    })
    .listen(port, () => {
      debugLog(`(${process.pid}) Open server at ${port}`);
    });

  return server;
};
