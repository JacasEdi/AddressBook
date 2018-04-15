import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Person} from '../../models/Person';
import {AngularFireDatabase} from 'angularfire2/database';
import {Router} from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  people: Person[];

  constructor(private firebaseService: FirebaseService,
              private firebase: AngularFireDatabase,
              private router: Router) {
    firebase.list<Person>('people').valueChanges().subscribe(people => {
      console.log(people);
      this.people = people;
    });
  }

  ngOnInit() {
  }

  editPerson(person: Person) {
    this.firebaseService.person = person;
    this.router.navigate(['/person']);
  }

  deletePerson(person: Person) {
    this.firebaseService.deletePerson(person);
  }
}
