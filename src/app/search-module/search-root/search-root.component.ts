import { Component, OnInit } from '@angular/core';
import {GravsearchServiceService} from "../../services/gravsearch-service.service";
import { Queries } from '../../queries/queries';
import { map } from 'rxjs/operators';

@Component({
  selector: 'kwa-search-root',
  templateUrl: './search-root.component.html',
  styleUrls: ['./search-root.component.scss']
})
export class SearchRootComponent implements OnInit {
    filters = [
        {value: 'title', viewValue: 'Title', type: 'string'},
        {value: 'text', viewValue: 'Text', type: 'string'},
        {value: 'date', viewValue: 'Date', type: 'date'}
    ];
    operators = {
        string: [
            {
                displayed: 'contains',
                operator: 'contains'
            },
            {
                displayed: 'equals',
                operator: '='
            }
        ],
        date: [
            {
                displayed: 'published after',
                operator: '<'
            },
            {
                displayed: 'published before',
                operator: '>'
            }
        ]
    };
    filterRows = Array<any>(1);
    chosenFilters = [];
    searchResults = [];
    queries: any = (new Queries).queries;

  constructor(
      private gravsearchServiceService: GravsearchServiceService
  ) { }

  ngOnInit(): void {
      console.log( 'initiate search' );
      this.gravsearchServiceService.sendGravsearchRequest( this.queries.noFilter.body )
          .pipe(
              map((response) => {
                  console.log( response );
                  return (response.body['@graph'] as any).map(entry => {
                      // here the structure of the array is created from the response
                      return {
                          title: entry['kwa:hasTitle']['knora-api:valueAsString'],
                          conceptId: entry['kwa:hasKwaConceptId']['knora-api:valueAsString'],
                          expressions: (entry['knora-api:hasIncomingLinkValue'] ? 
                          					( Array.isArray(entry['knora-api:hasIncomingLinkValue']) ? 
                          					(entry['knora-api:hasIncomingLinkValue'] as any).map(expression => {
                          					  //TODO: move mapping the expression into function
                          						return {
                          								title: expression['knora-api:linkValueHasSource']['kwa:hasTitle']['knora-api:valueAsString'],
                          								incipit: expression['knora-api:linkValueHasSource']['kwa:hasIncipit']['knora-api:valueAsString']                          							
                          								};
                          								}) :
                          								[{
                          									title: entry['knora-api:hasIncomingLinkValue']['knora-api:linkValueHasSource']['kwa:hasTitle']['knora-api:valueAsString'],
                          									incipit: entry['knora-api:hasIncomingLinkValue']['knora-api:linkValueHasSource']['kwa:hasIncipit']['knora-api:valueAsString']                          							                          									
                          								}])
                          								: undefined)
                          }})}))                                                
          .subscribe(
              transformedEntries => {
                  console.log( transformedEntries );
                  this.searchResults = transformedEntries;
              }, error => console.log( error )
          )
  }

    updateDefinedFilterArray( key: string, value: string, index: number ) {
      this.chosenFilters[ index ] = this.chosenFilters[ index ] ? this.chosenFilters[ index ] : {};
      this.chosenFilters[ index ][ key ] = value;
      console.log( this.chosenFilters );
    }

}
