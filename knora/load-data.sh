#/bin/bash
for filename in kwa-data/import/segment*.xml; do
    curl -v -u kwa-admin@example.com:Schaubuehne --data @"$filename" --header "Content-Type: application/xml" http://localhost:3333/v1/resources/xmlimport/http%3A%2F%2Frdfh.ch%2Fprojects%2F0829
done
