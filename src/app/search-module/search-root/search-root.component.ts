import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {GravsearchServiceService} from "../../services/gravsearch-service.service";
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'kwa-search-root',
    templateUrl: './search-root.component.html',
    styleUrls: ['./search-root.component.scss']
})
export class SearchRootComponent implements OnInit, AfterViewInit {
    @HostListener("window:scroll", ["$event"])
    onWindowScroll() {
        //In chrome and some browser scroll is given to body tag
        let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight;
        // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
        // console.log('scroll', pos, max);
        if( max - pos < 5 && !this.alreadyQueried )   {
            // console.log( 'reached bottom' );
            this.alreadyQueried = true;
            this.offset += 1;
            setTimeout(() => { // some time needed until template is rendered with updated variables
                this.sendGravSearchQuery( true );
            }, 500);

        }
    }
    constants = new constants();
    inputInformation = new inputInformation();
    filterRows = Array<any>(1);
    chosenFilters = [];
    searchResults = [];
    firstExampleFilter = '';
    offset = 0;
    spinnerIsLoading = false;
    alreadyQueried = false;
    @ViewChild('myTemplateRef') myTemplate;

    constructor(
        private gravsearchServiceService: GravsearchServiceService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
    }

    ngAfterViewInit() {
        this.sendGravSearchQuery();
    }

    sendGravSearchQuery( concatenate?: boolean ) {
        this.spinnerIsLoading = true;
        this.gravsearchServiceService.sendGravsearchRequest( this.myTemplate.elementRef.nativeElement.nextSibling.data )
            .pipe(
                map((response) => {
                    console.log(response);
                    return (response.body['@graph'] as any).map(entry => {
                        // here the structure of the array is created from the response
                        return {
                            title: entry['kwa:hasTitle']['knora-api:valueAsString'],
                            conceptId: entry['kwa:hasKwaConceptId']['knora-api:valueAsString'],
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
        for (let param in this.route.snapshot.queryParams) {
            if (typeof +param === 'number') {
                this.chosenFilters.push(JSON.parse(this.route.snapshot.queryParams[param]));
            }
        }
        console.log(this.chosenFilters);
        for (let i = 0; i < this.chosenFilters.length; i++) {
            this.filterRows[i] = {
                searchTerm: this.chosenFilters[i].searchTerm,
                filter: this.chosenFilters[i].filter,
                displayed: this.chosenFilters[i].operator
            };
        }
    }


    // maps a text expression.
    mapExpression(expression: any): any {
        return {
            title: expression['knora-api:linkValueHasSource']['kwa:hasTitle']['knora-api:valueAsString'],
            incipit: expression['knora-api:linkValueHasSource']['kwa:hasIncipit']['knora-api:valueAsString'],
            // here comes the fun part
            textcarrier: 
                 this.mapTextcarrier(expression['knora-api:linkValueHasSource']
                 ['kwa:standoffResourceTextResourceReferenceValue']
                 ['knora-api:linkValueHasTarget']
                 ['knora-api:hasIncomingLinkValue']
                 ['knora-api:linkValueHasSource']
                 ['kwa:onSurfaceValue']
                 ['knora-api:linkValueHasTarget']
                 ['kwa:partOfTextcarrierValue']
                 ['knora-api:linkValueHasTarget'])
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
        console.log(value);
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
        this.firstExampleFilter = '\t   FILTER knora-api:match(?title, \'Schnee\').\n' +
            '\t   OPTIONAL\n' +
            '\t   {\n' +
            '\t    FILTER (?issueTitle = \'Prager Tagblatt\').' +
            '\t   }\n';
        setTimeout(() => { // some time needed until template is rendered with updated variables
            this.sendGravSearchQuery();
        }, 500);
    }
}

class inputInformation {
    PREFIXES = {
        allPrefixed: 'PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>\n' +
            '        PREFIX walser: <http://0.0.0.0:3333/ontology/0829/kwa/simple/v2#>'
    };
}

class constants {

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
}
