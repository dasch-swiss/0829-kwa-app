import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {GravsearchServiceService} from "../../services/gravsearch-service.service";
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";
import { HttpClient } from "@angular/common/http";

declare var require: any;
var Mustache = require('mustache');

@Component({
    selector: 'kwa-search-root',
    templateUrl: './search-root.component.html',
    styleUrls: ['./search-root.component.scss']
})
export class SearchRootComponent implements OnInit {
    @Input() queryTemplate: string;
    @Input() queryInputData: any;
    @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
        let pos = ( document.documentElement.scrollTop || document.body.scrollTop ) + document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight;
        if ( max - pos < 5 && !this.alreadyQueried )   {
            this.alreadyQueried = true;
            this.offset += 1;
            setTimeout(() => {
                this.sendGravSearchQuery( true );
            }, 500);

        }
    }
    filterRows = Array<any>(1);
    chosenFilters = [];
    searchResults = [];
    firstExampleFilter = '';
    offset = 0;
    spinnerIsLoading = false;
    alreadyQueried = false;
    template;

    constructor(
    	private http: HttpClient,
        private gravsearchServiceService: GravsearchServiceService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
    }


    // ngAfterViewInit() {
    //     this.sendGravSearchQuery();
    // }

    sendGravSearchQuery( concatenate?: boolean ) {
        this.spinnerIsLoading = true;
        let gravSearchQuery = this.escapeHtml(
            Mustache.render(this.queryTemplate, this.queryInputData)
        );
        this.gravsearchServiceService.sendGravsearchRequest( gravSearchQuery )
            .pipe(
                map((response) => {
                    console.log(response);
                    return (response.body['@graph'] as any).map(entry => {
                        // here the structure of the array is created from the response
                        return {
                            title: this.returnValueOfPathOfObject(
                                entry,
                                ['kwa:hasTitle', 'knora-api:valueAsString']
                            ),
                            conceptId: this.returnValueOfPathOfObject(
                                entry,
                                ['kwa:hasKwaConceptId', 'knora-api:valueAsString']
                            ),
                            // expressions can be an array or an object or undefined!
                            // we want it to be an array in any case
                            expressions: (entry['knora-api:hasIncomingLinkValue'] ?
                                (Array.isArray(entry['knora-api:hasIncomingLinkValue']) ?
                                    (entry['knora-api:hasIncomingLinkValue'] as any)
                                        .map(expression => {
                                            return this.mapExpression(expression);
                                        })
                                    : [this.mapExpression(entry['knora-api:hasIncomingLinkValue'])])
                                : [])
                        }
                    })
                }))
            .subscribe(
                transformedEntries => {
                    console.log(transformedEntries);
                    this.spinnerIsLoading = false;
                    this.alreadyQueried = false;
                    if ( concatenate ) {
                        this.searchResults = this.searchResults.concat( transformedEntries );
                    } else {
                        this.searchResults = transformedEntries;
                    }
                }, error => {
                    console.log(error);
                    this.spinnerIsLoading = false;
                }
            );

    }

    ngOnInit(): void {
        for ( let param in this.route.snapshot.queryParams ) {
            if ( typeof +param === 'number' ) {
                this.chosenFilters.push(
                    JSON.parse( this.route.snapshot.queryParams[param] )
                );
            }
        }
        for ( let i = 0; i < this.chosenFilters.length; i++ ) {
            this.filterRows[i] = {
                searchTerm: this.chosenFilters[i].searchTerm,
                filter: this.chosenFilters[i].filter,
                displayed: this.chosenFilters[i].operator
            };
        }
    }

    generateFilters() : String
    {
    	var filterString = "";

         for (let filter of this.chosenFilters) {
         	switch (filter.operator)
         	{
        	case 'contains': {filterString += `FILTER knora-api:matchText(?${filter.filter}, "${filter.searchTerm}").
`;break;}
			case '=': {filterString += `FILTER( ?${filter.filter} = "${filter.searchTerm}").
`;break;}
    		}
    		}
    	console.log(filterString);
    	return filterString;
    }

    returnValueOfPathOfObject( object: any, path: Array<string> ) {
        // console.log( path, object, path.length );
        if ( path.length > 1 ) {
            const firstEntryOfArray = path.shift();
            // console.log( object[ firstEntryOfArray ], path );
            return this.returnValueOfPathOfObject( object[ firstEntryOfArray ], path );
        } else {
            // console.log( object[ path[ 0 ] ] );
            return object[ path[ 0 ] ];
        }
    }

    // maps a text expression.
    mapExpression(expression: any): any {
        return {
            title: this.returnValueOfPathOfObject(
                expression,
                this.queryInputData.responseToResultCardMapping.titlePath
            ),
            incipit: this.returnValueOfPathOfObject(
                expression,
                this.queryInputData.responseToResultCardMapping.incipitPath
            ),
            textcarrier:
                 this.mapTextcarrier(
                     this.returnValueOfPathOfObject(
                         expression,
                         [
                             'knora-api:linkValueHasSource',
                             'kwa:standoffResourceTextResourceReferenceValue',
                             'knora-api:linkValueHasTarget',
                             'knora-api:hasIncomingLinkValue',
                             'knora-api:linkValueHasSource',
                             'kwa:onSurfaceValue',
                             'knora-api:linkValueHasTarget',
                             'kwa:partOfTextcarrierValue',
                             'knora-api:linkValueHasTarget'
                         ]
                     )
                 )
        }
    }

    mapTextcarrier(textcarrier: any): any {
        return {
            imprintedDate: this.mapStringValueIfThere(textcarrier['kwa:hasImprintedDate']),
            title: this.mapStringValueIfThere(textcarrier['kwa:hasTitle']),
            number: this.mapStringValueIfThere(textcarrier['kwa:hasNumber'])
        }
    }

    // returns the string value of a value object if there, or an empty string if not.
    mapStringValueIfThere(valueObject)
    {
    	return valueObject ? valueObject['knora-api:valueAsString'] : '';
    }


    updateDefinedFilterArray(key: string, value: string, index: number) {
        this.chosenFilters[index] = this.chosenFilters[index] ? this.chosenFilters[index] : {};
        this.chosenFilters[index][key] = value;
        console.log(this.chosenFilters);
        this.updateUrlParams();
    }

    updateUrlParams() {
        let stringyfiedArray = [];
        for (let filter of this.chosenFilters) {
            stringyfiedArray.push(JSON.stringify(filter));
        }
        this.router.navigate([], {
            queryParams: stringyfiedArray
        });
    }

    performSearch() {
        // this.firstExampleFilter = '\t   FILTER knora-api:match(?title, \'Schnee\').\n' +
        //     '\t   OPTIONAL\n' +
        //     '\t   {\n' +
        //     '\t    FILTER (?issueTitle = \'Prager Tagblatt\').' +
        //     '\t   }\n';
        // console.log( this.queryInputData, this.queryTemplate, this.chosenFilters );
        const filters = {
            filters: this.chosenFilters
        };
        const queryUpdatedWithFilters = Mustache.render(this.queryTemplate, filters);
        // console.log( queryUpdatedWithFilters );
        this.sendGravSearchQuery();
    }
    escapeHtml(unsafe: string) {
        return unsafe
            .split( "&amp;").join( '&' )
            .split("&lt;").join( '<' )
            .split( "&gt;").join( '>' )
            .split( "&quot;").join( '"' )
            .split( "&#039;").join( '\'' )
            .split('&#x2F;').join( '/' );
    }
}
