# live-edit
 
Vanilla Javascript library that allows to create in line editing components.

### How to use it

An example of an HTML body adding the library and adding a le-textfield.

The attributes of the tag are:

* id: unique id for the field
* action: the url called when clicking ok to save the data
* method: GET or POST
* function: the funcion called in order to save the data
* parameters: parameters added to the call
* token: eventually added to prevent cross scripting attacks

```html
<body>
  <h3>Text field</h3>
	<le-textfield id="myid" action="internalapi.php" method="GET" function="renewthing" parameters="par1=1&par2=accent" token="mytokenhere">My content goes here</le-textfield>
  <script src="js/le-textfield.js"></script>
</body>
```


### To work on it using PHP integrated server

php -S localhost:8080


