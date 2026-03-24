import { db } from './db';

// This function purposefully demonstrates a `count-include-mismatch` bug
// which `catch-22` should flag.
export async function getMarinaDetails(id: string) {
  return await db.marinas.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          attachments: {
            where: { uploadCompleted: true }
          }
        }
      },
      // BUG: The include block is missing the uploadCompleted filter.
      // In practice, this exposes incomplete uploads to the UI, while the _count 
      // returns the number of completed ones, causing a mismatch.
      attachments: true 
    }
  });
}
