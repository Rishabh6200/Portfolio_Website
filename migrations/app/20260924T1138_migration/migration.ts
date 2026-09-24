#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7db805c42f9c5ee637772bba5ef7a5ce06f355dbc699bbaac456f326a6c1af03/contract';
import endContract from '../../snapshots/7db805c42f9c5ee637772bba5ef7a5ce06f355dbc699bbaac456f326a6c1af03/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/fc2514a5f96e607958427d6e6ec4a372ffc5ce0ad17d8c4c12047b93886af421/contract';
import startContract from '../../snapshots/fc2514a5f96e607958427d6e6ec4a372ffc5ce0ad17d8c4c12047b93886af421/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropDefault({ schema: 'public', table: 'profile', column: 'bio' }),
      this.dropDefault({ schema: 'public', table: 'profile', column: 'email' }),
      this.dropDefault({ schema: 'public', table: 'profile', column: 'location' }),
      this.dropDefault({ schema: 'public', table: 'profile', column: 'name' }),
      this.dropDefault({ schema: 'public', table: 'profile', column: 'role' }),
      this.dropDefault({ schema: 'public', table: 'profile', column: 'status' }),
      this.dropDefault({ schema: 'public', table: 'profile', column: 'tagline' }),
      this.dropDefault({ schema: 'public', table: 'profile', column: 'timezone' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
