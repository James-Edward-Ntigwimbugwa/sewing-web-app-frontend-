import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterationService {

  constructor(private apollo: Apollo) { }

  // Existing method for customer registration
  CreateCustomUser(email: string, first_name: string, last_name: string, password: string): Observable<any> {
    const CREATE_CUSTOM_USER = gql`
      mutation CreateCustomUser($email: String!, $first_name: String!, $last_name: String!, $password: String!) {
        createCustomUser(email: $email, firstName: $first_name, lastName: $last_name, password: $password) {
          customUser {
            id
            email
            firstName
            lastName
          }
          success
          message
        }
      }
    `;

    return this.apollo.mutate({
      mutation: CREATE_CUSTOM_USER,
      variables: {
        email: email,
        first_name: first_name,
        last_name: last_name,
        password: password
      }
    });
  }

  // New method for tailor registration
  RegisterTailor(
    fullName: string,
    username: string,
    email: string,
    nationalIdNumber: string,
    phoneNumber: string,
    sex: string,
    areaOfResidence: string,
    areaOfWork: string,
    password: string
  ): Observable<any> {
    const REGISTER_TAILOR = gql`
      mutation RegisterTailor(
        $fullName: String!,
        $username: String!,
        $email: String!,
        $nationalIdNumber: String!,
        $phoneNumber: String!,
        $sex: String!,
        $areaOfResidence: String!,
        $areaOfWork: String!,
        $password: String!
      ) {
        registerTailor(
          fullName: $fullName,
          username: $username,
          email: $email,
          nationalIdNumber: $nationalIdNumber,
          phoneNumber: $phoneNumber,
          sex: $sex,
          areaOfResidence: $areaOfResidence,
          areaOfWork: $areaOfWork,
          password: $password
        ) {
          tailor {
            id
            username
            fullName
            email
            phoneNumber
            sex
            areaOfResidence
            areaOfWork
          }
          success
          message
        }
      }
    `;

    return this.apollo.mutate({
      mutation: REGISTER_TAILOR,
      variables: {
        fullName,
        username,
        email,
        nationalIdNumber,
        phoneNumber,
        sex,
        areaOfResidence,
        areaOfWork,
        password
      }
    });
  }
}