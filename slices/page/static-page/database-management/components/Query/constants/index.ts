import { createQueries } from './create-queries';
import { readQueries } from './read-queries';
import { updateQueries } from './update-queries';
import { deleteQueries } from './delete-queries';
import { joinQueries } from './join-queries';
import { QueryCollection } from './types';

export const SAMPLE_QUERIES: QueryCollection = {
  create: createQueries,
  read: readQueries,
  update: updateQueries,
  delete: deleteQueries,
  join: joinQueries
};

export * from './types';
export * from './create-queries';
export * from './read-queries';
export * from './update-queries';
export * from './delete-queries';
export * from './join-queries';
