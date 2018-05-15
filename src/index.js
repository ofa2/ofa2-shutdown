async function invokeCallback(done) {
  process.nextTick(done);
}

function lift() {
  let beforeShutdown = this.config.beforeShutdown || invokeCallback;
  process.on('SIGINT', async () => {
    this.logger.info('Shutting down...');
    let startTime = Date.now();

    let err;
    try {
      await beforeShutdown();
      this.logger.info(`Shuted down...(in ${Date.now() - startTime}ms)`);
    }
    catch (e) {
      err = e;
    }

    this.lower().on('lowered', () => {
      process.exit(err ? 1 : 0);
    });
  });

  return new Promise((resolve) => {
    resolve();
  });
}

export default lift;
