import { HttpClient } from '@angular/common/http';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { HttpLink , } from 'apollo-angular/http';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

  providers: [HttpClient], // Ensure HttpClient is provided here
})
export class AppComponent {
  title = 'PROJECT';
  private apolloClient: ApolloClient<any>;


  constructor(private httpClient: HttpClient) {
    const httpLink = new HttpLink(httpClient);

    this.apolloClient = new ApolloClient({
      link: httpLink.create({ uri: 'http://127.0.0.1:8000/graphql/' }), // Your Django GraphQL endpoint
      cache: new InMemoryCache(),
    });


  }


}
