import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Person} from '../../models/Person';
import {AngularFireDatabase} from 'angularfire2/database';
import {Router} from '@angular/router';
import {Organisation} from '../../models/Organisation';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  people: Person[];
  organisations: Organisation[];

  constructor(private firebaseService: FirebaseService,
              private firebase: AngularFireDatabase,
              private router: Router) {
    // retrieve all People from a database
    firebase.list<Person>('people').valueChanges().subscribe(value => {
      this.people = value;
      this.sortPeople();
    });

    // retrieve all Organisations from a database
    firebase.list<Organisation>('organisations').valueChanges().subscribe(items => {
      this.organisations = items;

      // convert nested People objects inside each organisation to an array of Person
      for (const organisation of this.organisations) {
        organisation.people = this.objectToArray(organisation.people);
      }

      this.sortOrganisations();
    });
  }

  ngOnInit() {
  }

  editPerson(person: Person) {
    this.firebaseService.editedPerson = person;
    this.router.navigate(['/person']);
  }

  deletePerson(person: Person) {
    this.firebaseService.deletePerson(person);
  }

  editOrganisation(organisation: Organisation) {
    this.firebaseService.editedOrganisation = organisation;
    this.router.navigate(['/organisation']);
  }

  deleteOrganisation(organisation: Organisation) {
    this.firebaseService.deleteOrganisation(organisation);
  }

  // converts object retrieved from Firebase to an array so that data can be displayed in a template
  objectToArray(obj: any) {
    const dataArray = [];

    for (const o in obj) {
      dataArray.push(obj[o]);
    }

    return dataArray;
  }

  // sorts People array by last name
  sortPeople() {
    this.people.sort(function (a, b) {
      const nameA = a.lastName.toUpperCase(); // ignore upper and lowercase
      const nameB = b.lastName.toUpperCase(); // ignore upper and lowercase

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names are equal
      return 0;
    });
  }

  // sorts Organisations array by name
  sortOrganisations() {
    // sort by name
    this.organisations.sort(function (a, b) {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names are equal
      return 0;
    });
  }

  // removes Person from organisation, triggered by button click
  removePerson(organisation: Organisation, person: Person) {
    this.firebaseService.removePersonFromOrganisation(organisation, person);
  }
}
