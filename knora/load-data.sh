#/bin/bash
for filename in kwa-data/import/segment*.xml; do
    curl -v -u matthias.spruenglin@unibas.ch:Schaubuehne --data @"$filename" --header "Content-Type: application/xml" http://localhost:3333/v1/resources/xmlimport/http%3A%2F%2Frdfh.ch%2Fprojects%2FCAFE
done
