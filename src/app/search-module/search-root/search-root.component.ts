import { Component, OnInit } from '@angular/core';
import {GravsearchServiceService} from "../../services/gravsearch-service.service";
import { Queries } from '../../queries/queries';
import { map } from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";

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
      private gravsearchServiceService: GravsearchServiceService,
      private router: Router,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
      // console.log( this.route.snapshot.queryParams );
      for ( let param in this.route.snapshot.queryParams ) {
          if ( typeof +param === 'number' ) {
              this.chosenFilters.push( JSON.parse( this.route.snapshot.queryParams[ param ] ) );
          }
      }
      console.log( this.chosenFilters );
      for ( let i = 0; i < this.chosenFilters.length; i++ ) {
          this.filterRows[ i ] = {
              searchTerm: this.chosenFilters[ i ].searchTerm,
              filter: this.chosenFilters[ i ].filter,
              displayed: this.chosenFilters[ i ].operator
          };
      }
      this.gravsearchServiceService.sendGravsearchRequest( this.queries.noFilter.body )
          .pipe(
              map((response) => {
                  console.log( response );
                  return (response.body['@graph'] as any).map(entry => {
                      // here the structure of the array is created from the response
                      return {
                          title: entry['kwa:hasTitle']['knora-api:valueAsString'],
                          conceptId: entry['kwa:hasKwaConceptId']['knora-api:valueAsString'],
                          // expressions can be an array or an object or undefined!
                          // we want it to be an array in any case
                          expressions: ( entry['knora-api:hasIncomingLinkValue'] ?
                          					( Array.isArray(entry['knora-api:hasIncomingLinkValue']) ?
                          					( entry['knora-api:hasIncomingLinkValue'] as any).map(expression => {return this.mapExpression(expression);})
                          								: [this.mapExpression(entry['knora-api:hasIncomingLinkValue'])])
                          								: [])
                          }})}))
          .subscribe(
              transformedEntries => {
                  console.log( transformedEntries );
                  this.searchResults = transformedEntries;
              }, error => console.log( error )
          )
  }


   // maps a text expression.
   mapExpression( expression: any) : any {
   	   return {
				title: expression['knora-api:linkValueHasSource']['kwa:hasTitle']['knora-api:valueAsString'],
				incipit: expression['knora-api:linkValueHasSource']['kwa:hasIncipit']['knora-api:valueAsString'],
				// here comes the fun part
				textcarrier: this.mapTextcarrier( expression['knora-api:linkValueHasSource']['kwa:standoffResourceTextResourceReferenceValue']['knora-api:linkValueHasTarget']['knora-api:hasIncomingLinkValue']['knora-api:linkValueHasSource']['kwa:onSurfaceValue']['knora-api:linkValueHasTarget']['kwa:partOfTextcarrierValue']['knora-api:linkValueHasTarget'])
			}
		}


	mapTextcarrier ( textcarrier: any) : any {
		return {
				imprintedDate : textcarrier['kwa:hasImprintedDate']['knora-api:valueAsString'],
				title : textcarrier['kwa:hasTitle']['knora-api:valueAsString'],
				number : textcarrier['kwa:hasNumber']['knora-api:valueAsString']
		}
	}

    updateDefinedFilterArray( key: string, value: string, index: number ) {
      this.chosenFilters[ index ] = this.chosenFilters[ index ] ? this.chosenFilters[ index ] : {};
      console.log( value );
      this.chosenFilters[ index ][ key ] = value;
      console.log( this.chosenFilters );
      this.updateUrlParams();
    }

    updateUrlParams() {
        let stringyfiedArray = [];
        for ( let filter of this.chosenFilters ) {
            stringyfiedArray.push( JSON.stringify( filter ) );
        }
        this.router.navigate( [], {
            queryParams: stringyfiedArray
        } );
    }

}
