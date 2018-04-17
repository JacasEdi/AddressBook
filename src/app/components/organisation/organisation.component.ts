import {Component, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FirebaseService} from '../../services/firebase.service';
import {Organisation} from '../../models/Organisation';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.css']
})
export class OrganisationComponent implements OnInit {
  organisation: Organisation;

  options: FormGroup;
  matcher = new MyErrorStateMatcher();

  saveButtonText = 'Save';
  spinner: any;
  isEdited = false;

  // tracks the value and validation status of the name input field in the form
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50)
  ]);

  // tracks the value and validation status of the name input field in the form
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

  // tracks the value message text area in the form
  noteFormControl = new FormControl('', [
    Validators.maxLength(200)
  ]);

  constructor(fb: FormBuilder,
              private firebaseService: FirebaseService,
              private router: Router) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.organisation = new Organisation();

    this.spinner = document.getElementById('spinner');
    this.spinner.hidden = true;

    // organisation is being edited
    if (this.firebaseService.editedOrganisation != null) {
      this.organisation = this.firebaseService.editedOrganisation;
      this.isEdited = true;
    }
  }

  onSave() {
    this.spinner.hidden = false;
    this.saveButtonText = 'Saving...';

    let tmpOrganisation = new Organisation();
    tmpOrganisation.name = this.organisation.name;
    tmpOrganisation.address = this.organisation.address;
    tmpOrganisation.email = this.organisation.email;
    tmpOrganisation.phone = this.organisation.phone;
    tmpOrganisation.note = this.organisation.note;

    console.log('Edited? ' + this.isEdited);

    this.isEdited ? this.firebaseService.updateOrganisation(tmpOrganisation) :
      this.firebaseService.addOrganisation(tmpOrganisation);

    this.onSaveSuccessful();
  }

  // resets form to its original state
  onSaveSuccessful() {
    this.saveButtonText = 'Send';
    this.spinner.hidden = true;

    this.organisation.name = '';
    this.organisation.address = '';
    this.organisation.email = '';
    this.organisation.phone = null;
    this.organisation.note = '';

    this.nameFormControl.reset();
    this.nameFormControl.setErrors(null);
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
