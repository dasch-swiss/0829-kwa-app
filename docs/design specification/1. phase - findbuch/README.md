## Findbuch design specification Phase 1

### .1 Presentation of the Finddbuch as dynamic content queried from Knora

- The information of the findbuch is queried directly from Knora
- If the input field is empty all resources are shown. (If nothing is entered in the search input field, the first 25 results are loaded) if the user scrolls down to the 25th result, the next 25 results are loaded

### .2 Search form

- From the search form a sparql query is generated
- One functionality of the search form is that a link can be generated that saves the current chosen filters and values etc, so that the search can be reperformed

### .2.1 filter criteria

- the search field contains one empty filter row at first
- the search row allows to enter a search in a certain property, choosing an operator and typing of the value that has to be searched for
- Additional filter criteria can be added
- If there is more than one filter criteria, all criterias are linked with an AND

### .2.2

- Next to the filter criteria the search form enables the user to choose a sorting option of the search results
- You can sort by Lemma and Erstdruckdatum


### technological remarks

- the output will be an angular module
- this module can be included in an Angular project with the selector of the root component of the module
- the root component of this module has an input that allows the developer to configure aspects of the search, for instance
	- which properties can be searched for
	- Which fields / properties should be displayed in the result entries
	- Which sorting options exist

![./suchformular.png](./suchformular.png)

