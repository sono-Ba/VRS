import type {
  ViewerEvent,
  ViewerEventHandler,
  ViewerEventPayloads,
} from "./types";

/** Minimal typed event emitter shared by viewer adapters. */
export class ViewerEmitter {
  private handlers = new Map<ViewerEvent, Set<ViewerEventHandler<never>>>();

  on<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler as ViewerEventHandler<never>);
  }

  off<E extends ViewerEvent>(event: E, handler: ViewerEventHandler<E>): void {
    this.handlers.get(event)?.delete(handler as ViewerEventHandler<never>);
  }

  emit<E extends ViewerEvent>(event: E, payload: ViewerEventPayloads[E]): void {
    this.handlers.get(event)?.forEach((handler) => {
      (handler as ViewerEventHandler<E>)(payload);
    });
  }

  clear(): void {
    this.handlers.clear();
  }
}
