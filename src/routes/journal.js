import { Router } from 'express';
import { createJournalEntry, getJournalEntries, updateJournalEntry, deleteJournalEntry, getJournalEntry } from '../controllers/journalController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createJournalEntry);
router.get('/', getJournalEntries);
router.get('/:id', getJournalEntry);
router.put('/:id', updateJournalEntry);
router.delete('/:id', deleteJournalEntry);

export default router;
