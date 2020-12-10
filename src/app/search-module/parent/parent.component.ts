import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kwa-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {
    queryTemplate: string;
    queryInputData: any;
    filterVariables: any;
  constructor() { }

  ngOnInit(): void {
      this.queryTemplate =
          '{{#prefixes}}\n' +
          '{{.}}\n' +
          '{{/prefixes}}\n' +
          'CONSTRUCT {\n' +
          '        ?textconcept knora-api:isMainResource true;\n' +
          '            walser:hasTitle ?conceptTitle;\n' +
          '            walser:hasKwaConceptId ?conceptId.\n' +
          '\n' +
          '\t\t?textexpression walser:hasTitle ?title ;\n' +
          '\t\t    walser:hasIncipit ?incipit ;\n' +
          '\t\t    walser:isTextconceptInstance ?textconcept;\n' +
          '        \twalser:standoffResourceTextResourceReference ?textmanifest .\n' +
          '\n' +
          '        ?textmanifest walser:hasKwaManifestId ?manifestId.\n' +
          '\n' +
          '        ?column walser:standoffResourceTextResourceReference ?textmanifest ;\n' +
          '                walser:onSurface ?surface .\n' +
          '\n' +
          '        ?surface walser:partOfTextcarrier ?textcarrier.\n' +
          '\n' +
          '        ?textcarrier walser:hasName ?textcarrierName.\n' +
          '\n' +
          '\n' +
          '        ?textcarrier walser:hasNumber ?issueNumber;\n' +
          '                         walser:hasTitle ?tcTitle;\n' +
          '                         walser:hasImprintedDate ?imprintedDate;\n' +
          '                         walser:hasPublicationDate ?pubdate;\n' +
          '\n' +
          '\n' +
          '        }\n' +
          '        WHERE\n' +
          '        {\n' +
          '        ?textconcept walser:hasTitle ?conceptTitle;\n' +
          '                     walser:hasKwaConceptId ?conceptId.\n' +
          '\n' +
          '\t\t?textexpression a walser:Textexpression ;\n' +
          '        \twalser:hasTitle ?title ;\n' +
          '        \twalser:hasIncipit ?incipit ;\n' +
          '        \twalser:isTextconceptInstance ?textconcept;\n' +
          '\t        walser:standoffResourceTextResourceReference ?textmanifest .\n' +
          '\n' +
          '\n' +
          '\t      ?textmanifest walser:hasKwaManifestId ?manifestId.\n' +
          '\n' +
          '        ?column walser:standoffResourceTextResourceReference ?textmanifest ;\n' +
          '                walser:onSurface ?surface .\n' +
          '\n' +
          '        ?surface walser:partOfTextcarrier ?textcarrier.\n' +
          '\n' +
          '        ?textcarrier walser:hasName ?textcarrierName.\n' +
          '\n' +
          '        ?textcarrier walser:hasNumber ?issueNumber;\n' +
          '        walser:hasTitle ?tcTitle;\n' +
          '        walser:hasImprintedDate ?imprintedDate;\n' +
          '        walser:hasPublicationDate ?pubdate;\n' +
          '        {{#filters}}\n' +
          '# Here mustache iterates over the filters {{filter}} {{operator}} {{searchTerm}}' +
          '}} \n' +
          '{{/filters}}\n' +
          '\n' +
          '        }\n' +
          '        ORDER by ?conceptTitle\n';
      this.queryInputData = {
          prefixes: [
              'PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>\n',
              'PREFIX walser: <http://0.0.0.0:3333/ontology/0829/kwa/simple/v2#>\n'
          ],
          filterVariables: {

              filters: [
                  {value: 'title', viewValue: 'Texttitel', type: 'string'},
                  {value: 'incipit', viewValue: 'incipit', type: 'string'},
                  {value: 'tcTitle', viewValue: 'Textträgertitel', type: 'string'},
                  {value: 'pubdate', viewValue: 'Publikationsdatum', type: 'date'}
              ],

              optionalFields: ['issueTitle', 'pubdate'],

              operators: {
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
              },

          },
          responseToResultCardMapping: {
              titlePath: ['knora-api:linkValueHasSource','kwa:hasTitle','knora-api:valueAsString'],
              incipitPath: ['knora-api:linkValueHasSource', 'kwa:hasIncipit', 'knora-api:valueAsString'],
              textCarrierPath: [
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
          }
      };
  }

}
