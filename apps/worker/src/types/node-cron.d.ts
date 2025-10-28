declare module 'node-cron' {
  export interface ScheduleOptions {
    scheduled?: boolean;
  }

  export interface ScheduledTask {
    start: () => void;
    stop: () => void;
  }

  export function schedule(
    expression: string,
    handler: () => void | Promise<void>,
    options?: ScheduleOptions,
  ): ScheduledTask;

  const cron: {
    schedule: typeof schedule;
  };

  export default cron;
}
