import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface WebhookPayload {
  [key: string]: unknown;
}

export class WebhookDispatcher {
  /**
   * Stubs the dispatch of a webhook event to all subscribed endpoints for an organization.
   */
  static async dispatch(organizationId: string, eventType: string, payload: WebhookPayload) {
    // 1. Log the event
    const event = await prisma.webhookEvent.create({
      data: {
        organizationId,
        type: eventType,
        payload: payload as unknown as Prisma.InputJsonValue,
      }
    });

    // 2. Find active endpoints subscribed to this event type
    const endpoints = await prisma.webhookEndpoint.findMany({
      where: {
        organizationId,
        isActive: true,
        events: { has: eventType }
      }
    });

    // 3. Create delivery records for each endpoint (Stubbed Delivery)
    const deliveries = await Promise.all(endpoints.map(endpoint => 
      prisma.webhookDelivery.create({
        data: {
          endpointId: endpoint.id,
          eventId: event.id,
          status: "PENDING",
        }
      })
    ));

    // In a real implementation, we would send these to a message queue (e.g. BullMQ, Inngest)
    // for background HTTP POST delivery. For now, we simulate processing by leaving them PENDING.
    console.log(`[WebhookDispatcher] Enqueued ${deliveries.length} deliveries for event ${eventType}`);
    
    return event;
  }
}
