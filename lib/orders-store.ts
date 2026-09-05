import { Order } from "@/types";

// Armazenamento em memória resiliente para modo apresentação e fallback
const globalForOrders = globalThis as unknown as {
  mockOrders: Map<number, Order>;
};

export const memoryOrders =
  globalForOrders.mockOrders ?? new Map<number, Order>();

globalForOrders.mockOrders = memoryOrders;

export function saveMemoryOrder(order: Order): void {
  memoryOrders.set(Number(order.id), order);
}

export function getMemoryOrder(id: number | string): Order | undefined {
  return memoryOrders.get(Number(id));
}

