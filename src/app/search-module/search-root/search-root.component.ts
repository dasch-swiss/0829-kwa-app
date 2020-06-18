import { Component, OnInit } from '@angular/core';

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
    searchResults = Array<any>(50);
  constructor() { }

  ngOnInit(): void {
  }

    updateDefinedFilterArray( key: string, value: string, index: number ) {
      this.chosenFilters[ index ] = this.chosenFilters[ index ] ? this.chosenFilters[ index ] : {};
      this.chosenFilters[ index ][ key ] = value;
      console.log( this.chosenFilters );
    }

}
