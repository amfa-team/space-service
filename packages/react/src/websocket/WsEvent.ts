import { Event as EventShim } from "event-target-shim";

export class WsEvent<T extends string, D> extends EventShim<T> {
  data: D;

  constructor(type: T, data: D) {
    super(type);
    this.data = data;
  }
}
