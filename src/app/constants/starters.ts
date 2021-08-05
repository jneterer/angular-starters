import { StarterStatuses } from "contracts/starters/starter";

export const STARTER_STATUSES: StarterStatuses[] = [
  {
    value: 'ACTIVE',
    label: 'ACTIVE',
    description: 'Will make this starter will be made public.'
  },
  {
    value: 'REJECTED',
    label: 'REJECTED',
    description: 'This starter is not approved to be made public, and revisions will not be accepted.'
  },
  {
    value: 'REVIEW',
    label: 'REVIEW',
    description: 'Notifies the Angular Starters team to review this starter.'
  },
  {
    value: 'REVISE',
    label: 'REVISE',
    description: 'Notifies the user that they need to make revisions to their starter.'
  }
];