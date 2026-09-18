#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/895ccc9a4f879da29d20d0230219e55ac67af94b95c79b7a63ea0218f1719ec3/contract';
import startContract from '../../snapshots/895ccc9a4f879da29d20d0230219e55ac67af94b95c79b7a63ea0218f1719ec3/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/fc2514a5f96e607958427d6e6ec4a372ffc5ce0ad17d8c4c12047b93886af421/contract';
import endContract from '../../snapshots/fc2514a5f96e607958427d6e6ec4a372ffc5ce0ad17d8c4c12047b93886af421/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'project',
        constraint: 'project_status_check_bc64f66b',
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'project',
        constraint: 'project_status_check_1b4a7b6b',
        expression: "\"status\" IN ('DRAFT', 'PUBLISHED')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
