import { prisma } from "@/lib/prisma";
import { IOcrProvider } from "../engine/provider";
import { providerRegistry } from "./registry";

export interface RoutedProvider {
  dbId: string;
  code: string;
  instance: IOcrProvider;
}

export class ProviderRouter {
  
  /**
   * Routes a request for a specific feature to the best available provider.
   * Returns an array of providers sorted by priority for failover.
   */
  async getRoutingQueue(organizationId: string, feature: string): Promise<RoutedProvider[]> {
    // 1. Fetch all enabled providers for this organization that support the feature
    const providers = await prisma.aIProvider.findMany({
      where: {
        organizationId,
        enabled: true,
        supportedFeatures: { has: feature },
        // We can still try to route to WARNING, but maybe skip OFFLINE
        status: { not: "OFFLINE" }
      },
      orderBy: {
        priority: "desc"
      }
    });

    if (providers.length === 0) {
      throw new Error(`No enabled providers found for feature '${feature}' in organization ${organizationId}.`);
    }

    // 2. Map to registry instances
    const queue: RoutedProvider[] = [];
    for (const p of providers) {
      try {
        const instance = providerRegistry.getProvider(p.code);
        queue.push({ dbId: p.id, code: p.code, instance });
      } catch (_err) {
        console.warn(`Provider ${p.code} is in DB but missing from code registry.`);
      }
    }

    if (queue.length === 0) {
      throw new Error(`Failed to instantiate any providers for feature '${feature}'.`);
    }

    return queue;
  }
}

export const providerRouter = new ProviderRouter();
