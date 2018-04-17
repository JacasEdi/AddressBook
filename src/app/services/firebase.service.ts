import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Person} from '../models/Person';
import {Organisation} from '../models/Organisation';

@Injectable()
export class FirebaseService {
  editedPerson: Person;
  editedOrganisation: Organisation;

  constructor(private firebase: AngularFireDatabase) {}

  // adds new person to a database
  addPerson(person: Person) {
    const newKey = this.firebase.database.ref().child('people').push().key;
    person.id = newKey;
    this.firebase.database.ref().child('people').child(`${newKey}`).set(JSON.parse(JSON.stringify(person)));

    if (person.organisation) {
      this.firebase.database.ref().child('organisations').child(`${person.organisation.name}`)
        .child('people').child(`${person.id}`).set(JSON.parse(JSON.stringify(person)));
    }
  }

  // adds new organisation to a database
  addOrganisation(organisation: Organisation) {
    this.firebase.database.ref().child('organisations')
      .child(organisation.name).set(JSON.parse(JSON.stringify(organisation)));
  }

  // updates existing person in a database
  updatePerson(person: Person) {
    this.firebase.database.ref().child('people').child(`${person.id}`).update(JSON.parse(JSON.stringify(person)));

    if (person.organisation) {
      this.firebase.database.ref().child('organisations').child(`${person.organisation.name}`)
        .child('people').child(`${person.id}`).set(JSON.parse(JSON.stringify(person)));
    }
  }

  // updates existing organisation in a database
  updateOrganisation(organisation: Organisation) {
    this.firebase.database.ref().child('organisations').child(`${organisation.name}`).update(JSON.parse(JSON.stringify(organisation)));
  }

  // deletes a person from a database
  deletePerson(person: Person) {
    this.firebase.database.ref().child(`people/${person.id}`).remove();
  }

  // deletes an organisation from a database
  deleteOrganisation(organisation: Organisation) {
    this.firebase.database.ref().child(`people/${organisation.name}`).remove();
  }

  // removes person from a specified organisation in a database
  removePersonFromOrganisation(organisation: Organisation, person: Person) {
    console.log("Removing person: " + person.id + " from: " + organisation.name);
    this.firebase.database.ref().child(`organisations/${organisation.name}`)
      .child('people').child(`${person.id}`).remove();
  }
}
