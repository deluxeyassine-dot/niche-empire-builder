/**
 * EmpireManager - Manages multiple niche empires
 *
 * This class provides centralized management for multiple empire instances,
 * allowing you to create, monitor, pause, resume, and synchronize multiple
 * niche empires simultaneously.
 */

import { NicheEmpireBuilder } from './NicheEmpireBuilder';

export type EmpireStatus = 'creating' | 'active' | 'paused' | 'building' | 'launched' | 'error';

export interface Empire {
  id: string;
  niche: string;
  status: EmpireStatus;
  builder: NicheEmpireBuilder;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    phase: 'initialized' | 'analyzed' | 'branded' | 'products' | 'website' | 'launched';
    lastError?: string;
    launchUrl?: string;
    [key: string]: any;
  };
}

export interface EmpireListItem {
  id: string;
  niche: string;
  status: EmpireStatus;
  phase: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmpireStatusDetail extends EmpireListItem {
  builderState: {
    initialized: boolean;
    currentNiche: string | null;
    hasBrand: boolean;
    productCount: number;
    hasWebsite: boolean;
  };
  metadata: Empire['metadata'];
}

export interface SyncResult {
  empireId: string;
  niche: string;
  previousStatus: EmpireStatus;
  currentStatus: EmpireStatus;
  updated: boolean;
  error?: string;
}

export class EmpireManager {
  private empires: Map<string, Empire> = new Map();
  private idCounter: number = 0;

  /**
   * Create a new empire instance
   * @param niche - The niche for this empire (e.g., "sustainable pet products")
   * @param config - Optional configuration for the empire builder
   * @returns The created empire object
   */
  async createEmpire(
    niche: string,
    config?: { apiKey?: string; [key: string]: any }
  ): Promise<Empire> {
    const id = this.generateId();
    const builder = new NicheEmpireBuilder();

    try {
      await builder.initialize(config);

      const empire: Empire = {
        id,
        niche,
        status: 'active',
        builder,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          phase: 'initialized'
        }
      };

      this.empires.set(id, empire);
      console.log(`Empire "${id}" created for niche: ${niche}`);

      return empire;
    } catch (error) {
      console.error(`Failed to create empire for niche "${niche}":`, error);
      throw new Error(`Failed to create empire: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List all empires with their basic information
   * @param filterStatus - Optional status filter to show only empires with specific status
   * @returns Array of empire list items
   */
  listEmpires(filterStatus?: EmpireStatus): EmpireListItem[] {
    const empireList: EmpireListItem[] = [];

    for (const [id, empire] of this.empires.entries()) {
      if (filterStatus && empire.status !== filterStatus) {
        continue;
      }

      empireList.push({
        id,
        niche: empire.niche,
        status: empire.status,
        phase: empire.metadata.phase,
        createdAt: empire.createdAt,
        updatedAt: empire.updatedAt
      });
    }

    // Sort by creation date (newest first)
    empireList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return empireList;
  }

  /**
   * Get detailed status of a specific empire
   * @param empireId - The ID of the empire to query
   * @returns Detailed empire status information
   */
  getEmpireStatus(empireId: string): EmpireStatusDetail {
    const empire = this.empires.get(empireId);

    if (!empire) {
      throw new Error(`Empire with ID "${empireId}" not found`);
    }

    const builderState = empire.builder.getState();

    return {
      id: empire.id,
      niche: empire.niche,
      status: empire.status,
      phase: empire.metadata.phase,
      createdAt: empire.createdAt,
      updatedAt: empire.updatedAt,
      builderState,
      metadata: empire.metadata
    };
  }

  /**
   * Pause an active empire
   * @param empireId - The ID of the empire to pause
   * @returns The updated empire object
   */
  pauseEmpire(empireId: string): Empire {
    const empire = this.empires.get(empireId);

    if (!empire) {
      throw new Error(`Empire with ID "${empireId}" not found`);
    }

    if (empire.status === 'paused') {
      console.log(`Empire "${empireId}" is already paused`);
      return empire;
    }

    if (empire.status === 'error') {
      throw new Error(`Cannot pause empire "${empireId}" with error status. Fix errors first.`);
    }

    empire.status = 'paused';
    empire.updatedAt = new Date();

    console.log(`Empire "${empireId}" (${empire.niche}) has been paused`);

    return empire;
  }

  /**
   * Resume a paused empire
   * @param empireId - The ID of the empire to resume
   * @returns The updated empire object
   */
  resumeEmpire(empireId: string): Empire {
    const empire = this.empires.get(empireId);

    if (!empire) {
      throw new Error(`Empire with ID "${empireId}" not found`);
    }

    if (empire.status !== 'paused') {
      throw new Error(`Cannot resume empire "${empireId}". Only paused empires can be resumed. Current status: ${empire.status}`);
    }

    // Restore to appropriate status based on phase
    if (empire.metadata.phase === 'launched') {
      empire.status = 'launched';
    } else {
      empire.status = 'active';
    }

    empire.updatedAt = new Date();

    console.log(`Empire "${empireId}" (${empire.niche}) has been resumed`);

    return empire;
  }

  /**
   * Delete an empire from the manager
   * @param empireId - The ID of the empire to delete
   * @returns True if empire was deleted, false if not found
   */
  deleteEmpire(empireId: string): boolean {
    const empire = this.empires.get(empireId);

    if (!empire) {
      console.warn(`Empire with ID "${empireId}" not found`);
      return false;
    }

    const niche = empire.niche;
    const deleted = this.empires.delete(empireId);

    if (deleted) {
      console.log(`Empire "${empireId}" (${niche}) has been deleted`);
    }

    return deleted;
  }

  /**
   * Sync all empires to update their status and metadata
   * @returns Array of sync results for each empire
   */
  async syncAllEmpires(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    console.log(`Syncing ${this.empires.size} empire(s)...`);

    for (const [id, empire] of this.empires.entries()) {
      const previousStatus = empire.status;

      try {
        // Skip paused empires
        if (empire.status === 'paused') {
          results.push({
            empireId: id,
            niche: empire.niche,
            previousStatus,
            currentStatus: empire.status,
            updated: false
          });
          continue;
        }

        // Get current builder state
        const builderState = empire.builder.getState();

        // Update phase based on builder state
        let newPhase = empire.metadata.phase;

        if (builderState.hasWebsite) {
          newPhase = 'website';
        } else if (builderState.productCount > 0) {
          newPhase = 'products';
        } else if (builderState.hasBrand) {
          newPhase = 'branded';
        } else if (builderState.currentNiche) {
          newPhase = 'analyzed';
        } else if (builderState.initialized) {
          newPhase = 'initialized';
        }

        // Update metadata if phase changed
        const updated = newPhase !== empire.metadata.phase;
        if (updated) {
          empire.metadata.phase = newPhase;
          empire.updatedAt = new Date();
        }

        results.push({
          empireId: id,
          niche: empire.niche,
          previousStatus,
          currentStatus: empire.status,
          updated
        });

      } catch (error) {
        empire.status = 'error';
        empire.metadata.lastError = error instanceof Error ? error.message : 'Unknown sync error';
        empire.updatedAt = new Date();

        results.push({
          empireId: id,
          niche: empire.niche,
          previousStatus,
          currentStatus: 'error',
          updated: true,
          error: empire.metadata.lastError
        });

        console.error(`Error syncing empire "${id}":`, error);
      }
    }

    console.log(`Sync complete. ${results.filter(r => r.updated).length} empire(s) updated.`);

    return results;
  }

  /**
   * Get a specific empire instance by ID
   * @param empireId - The ID of the empire to retrieve
   * @returns The empire object
   */
  getEmpire(empireId: string): Empire {
    const empire = this.empires.get(empireId);

    if (!empire) {
      throw new Error(`Empire with ID "${empireId}" not found`);
    }

    return empire;
  }

  /**
   * Get total number of empires being managed
   * @returns Total empire count
   */
  getEmpireCount(): number {
    return this.empires.size;
  }

  /**
   * Get count of empires by status
   * @returns Object mapping status to count
   */
  getEmpireCountByStatus(): Record<EmpireStatus, number> {
    const counts: Record<EmpireStatus, number> = {
      creating: 0,
      active: 0,
      paused: 0,
      building: 0,
      launched: 0,
      error: 0
    };

    for (const empire of this.empires.values()) {
      counts[empire.status]++;
    }

    return counts;
  }

  /**
   * Generate a unique ID for a new empire
   * @private
   */
  private generateId(): string {
    this.idCounter++;
    const timestamp = Date.now().toString(36);
    const counter = this.idCounter.toString(36).padStart(3, '0');
    return `emp_${timestamp}_${counter}`;
  }
}
