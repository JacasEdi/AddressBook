import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {Person} from '../../models/Person';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {FirebaseService} from '../../services/firebase.service';
import {Router} from '@angular/router';
import {Organisation} from '../../models/Organisation';
import {AngularFireDatabase} from 'angularfire2/database';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  person: Person;
  organisations: Organisation[];

  options: FormGroup;
  matcher = new MyErrorStateMatcher();

  saveButtonText = 'Save';
  spinner: any;
  isEdited = false;

  // tracks the value and validation status of the first name input field in the form
  firstNameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
    Validators.pattern('[a-zA-Z][a-zA-Z ]*')
  ]);

  // tracks the value and validation status of the last name input field in the form
  lastNameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
    Validators.pattern('[a-zA-Z][a-zA-Z ]*')
  ]);

  // tracks the value and validation status of the address input field in the form
  addressFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(100),
  ]);

  // tracks the value and validation status of the email input field in the form
  emailFormControl = new FormControl('', [
    Validators.maxLength(50),
    Validators.email,
  ]);

  // tracks the value and validation status of the phone input field in the form
  phoneFormControl = new FormControl('', [
    Validators.maxLength(20),
    Validators.pattern('^([+]?\\d{1,2}[-\\s]?|)\\d{3}[-\\s]?\\d{3}[-\\s]?\\d{4}$'),
  ]);

  // tracks the value of the note text area in the form
  noteFormControl = new FormControl('', [
    Validators.maxLength(200)
  ]);

  constructor(fb: FormBuilder,
              private firebaseService: FirebaseService,
              private firebase: AngularFireDatabase,
              private router: Router) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });

    firebase.list<Organisation>('organisations').valueChanges().subscribe(value => {
      console.log(value);
      this.organisations = value;
    });
  }

  ngOnInit() {
    this.person = new Person();

    this.spinner = document.getElementById('spinner');
    this.spinner.hidden = true;

    // person is being edited
    if (this.firebaseService.editedPerson != null) {
      this.person = this.firebaseService.editedPerson;
      this.isEdited = true;
    }
  }

  onSave() {
    this.spinner.hidden = false;
    this.saveButtonText = 'Saving...';

    let tmpPerson = new Person();
    tmpPerson.id = this.person.id;
    tmpPerson.firstName = this.person.firstName;
    tmpPerson.lastName = this.person.lastName;
    tmpPerson.address = this.person.address;
    tmpPerson.email = this.person.email;
    tmpPerson.phone = this.person.phone;
    tmpPerson.organisation = this.person.organisation;
    tmpPerson.note = this.person.note;

    this.isEdited ? this.firebaseService.updatePerson(tmpPerson) :
      this.firebaseService.addPerson(tmpPerson);

    this.onSaveSuccessful();
  }

  // resets form to its original state
  onSaveSuccessful() {
    this.saveButtonText = 'Send';
    this.spinner.hidden = true;

    this.person.id = '';
    this.person.firstName = '';
    this.person.lastName = '';
    this.person.address = '';
    this.person.email = '';
    this.person.phone = null;
    this.person.organisation = null;
    this.person.note = '';

    this.firstNameFormControl.reset();
    this.firstNameFormControl.setErrors(null);
    this.lastNameFormControl.reset();
    this.lastNameFormControl.setErrors(null);
    this.addressFormControl.reset();
    this.addressFormControl.setErrors(null);
    this.emailFormControl.reset();
    this.emailFormControl.setErrors(null);
    this.phoneFormControl.reset();
    this.phoneFormControl.setErrors(null);
    this.noteFormControl.reset();
    this.noteFormControl.setErrors(null);

    this.router.navigate(['']);
  }

}
