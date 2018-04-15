import { Person } from './Person';

export class Organisation {
  name: string;
  address: string;
  phone: number;
  email: string;
  people: Person[];

  constructor(name: string, address: string) {
    this.name = name;
    this.address = address;
  }
}

