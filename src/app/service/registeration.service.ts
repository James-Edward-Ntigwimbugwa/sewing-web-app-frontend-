import { Injectable } from '@angular/core';
import { Apollo, ApolloBase } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { gql } from 'apollo-angular';


@Injectable({
  providedIn: 'root'
})
export class RegisterationService {

  
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    
  }
  
  CreateCustomUser(email: string, firstName: string, lastName: string, password: string) {
    const mutation = gql`
      mutation MyMutation($email: String!, $firstName: String!, $lastName: String!, $password: String!) {
        createCustomUser(email: $email, firstName: $firstName, lastName: $lastName, password: $password) {
          customUser {
            email
            firstName
            lastName
          }
        }
      }
    `;
  
    return this.apollo.mutate({
      mutation,
      variables: {
        email,
        firstName,
        lastName,
        password,
      },
    });
  }
  
}
