import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Person} from '../models/Person';
import {Organisation} from '../models/Organisation';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FirebaseService {
  people: Observable<Person[]>;
  person: Person;

  constructor(private firebase: AngularFireDatabase) {
  }

  addPerson(person: Person) {
    const newKey = this.firebase.database.ref().child('people').push().key;
    console.log('Key: ' + newKey);
    person.id = newKey;
    this.firebase.database.ref().child('people').child(`${newKey}`).set(JSON.parse(JSON.stringify(person)));
  }

  addOrganisation(organisation: Organisation) {
    const firebaseRef = this.firebase.database.ref().child('organisations')
      .child(new Date().getTime().toLocaleString()).set(organisation);
  }

  updatePerson(person: Person) {
    console.log('Person id in firebase service: ' + person.id);

    this.firebase.database.ref().child('people').child(`${person.id}`).update(JSON.parse(JSON.stringify(person)));
  }

  deletePerson(person: Person) {
    console.log('Id: ' + person.id);
    this.firebase.database.ref().child(`people/${person.id}`).remove();
  }
}
