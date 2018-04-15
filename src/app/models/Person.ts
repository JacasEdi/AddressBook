import { Organisation } from './Organisation';

export class Person {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone?: number;
  email?: string;
  organisation?: Organisation;
  note?: string;

  constructor() {}
}
