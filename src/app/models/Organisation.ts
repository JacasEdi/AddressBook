import { Person } from './Person';

export class Organisation {
  name: string;
  address: string;
  phone: number;
  email: string;
  note?: string;
  people?: Person[];

  constructor() {}
}

