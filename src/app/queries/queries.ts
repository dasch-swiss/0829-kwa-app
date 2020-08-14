export class Queries {
    queries = {
        noFilter: {
            body: 'PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#> \n' +
                'PREFIX walser: <http://0.0.0.0:3333/ontology/0829/kwa/simple/v2#>\n' +
                '\n' +
                'CONSTRUCT {\n' +
                '        ?textconcept knora-api:isMainResource true;\n' +
                '            walser:hasTitle ?conceptTitle;\n' +
                '            walser:hasKwaConceptId ?conceptId.\n' +
                '\n' +
                '\t\t?textexpression walser:hasTitle ?title ;\n' +
                '\t\t    walser:hasIncipit ?incipit ;\n' +
                '\t\t    walser:isTextconceptInstance ?textconcept;\n' +
                '        \twalser:standoffResourceTextResourceReference ?textmanifest .\n' +
                '        \t\n' +
                '        ?textmanifest walser:hasKwaManifestId ?manifestId.\n' +
                '        \n' +
                '        ?column walser:standoffResourceTextResourceReference ?textmanifest ;\n' +
                '                walser:onSurface ?surface .\n' +
                '                \n' +
                '        ?surface walser:partOfTextcarrier ?textcarrier.\n' +
                '        \n' +
                '        ?textcarrier walser:hasName ?textcarrierName.\n' +
                '        \n' +
                '\n' +
                '        ?textcarrier walser:hasNumber ?issueNumber;\n' +
                '                         walser:hasTitle ?issueTitle;\n' +
                '                         walser:hasImprintedDate ?imprintedDate.             \n' +
                '        \n' +
                '        \n' +
                ' }\n' +
                'WHERE\n' +
                '{\n' +
                '        ?textconcept walser:hasTitle ?conceptTitle;\n' +
                '                     walser:hasKwaConceptId ?conceptId.\n' +
                '\n' +
                '\t\t?textexpression a walser:Textexpression ;\n' +
                '        \twalser:hasTitle ?title ;\n' +
                '        \twalser:hasIncipit ?incipit ;\n' +
                '        \twalser:isTextconceptInstance ?textconcept;\n' +
                '\t        walser:standoffResourceTextResourceReference ?textmanifest .\n' +
                '\t     \n' +
                '\n' +
                '\t      ?textmanifest walser:hasKwaManifestId ?manifestId.\n' +
                '        \n' +
                '        ?column walser:standoffResourceTextResourceReference ?textmanifest ;\n' +
                '                walser:onSurface ?surface .\n' +
                '                \n' +
                '        ?surface walser:partOfTextcarrier ?textcarrier.\n' +
                '        \n' +
                '        ?textcarrier walser:hasName ?textcarrierName.\n' +
                '        \n' +
                '         OPTIONAL {\n' +
                '            ?textcarrier walser:hasNumber ?issueNumber;\n' +
                '                         walser:hasTitle ?issueTitle;\n' +
                '                         walser:hasImprintedDate ?imprintedDate.\n' +
                '        }\n' +
                '\t       \t      \n' +
                '} \n' +
                'ORDER by ?conceptTitle\n'
        }
    }
}
