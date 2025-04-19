# live-edit
 
Vanilla Javascript library that allows to create in line editing components.

# Features

* Primarily driven by markup on the page
* Framework independent

### How to use it

Add the library at the bottom of your HTML file before closing the body tag.


```html
<body>
  <h3>Example</h3>
  <!-- Add the library before closing the body tag -->
  <script src="js/le-textfield.js"></script>
</body>
```

The library will define a new HTML tag named: **le-textfield**

The required attributes of the tag are:

* id: unique id for the field
* action: the url called when clicking ok to save the data
* method: GET or POST

The optional attributes are:

* type: default text but it can be: button, checkbox, color, date, datetime-local, email, file, image, month, number, password, radio, range, reset, search, tel, time, url, week
* function: the function called in order to save the data
* parameters: parameters added to the call
* csrftoken: eventually added to prevent cross scripting attacks
* data: data to populate <select> field formata: 
* dataurl: url where data can be loaded from in order to populate <select> field formata:

Optional attributes that allow to personalize the look of the form:

* formclass: css class applied to form tag
* fieldclass: css class applied to field tag
* okclass:  css class applied to ok button
* cancelclass: css class applied to cancel button (if present)

```html
<body>
  <h3>Text field</h3>
  <le-textfield id="myid" action="internalapi.php" method="GET" function="renewthing" parameters="par1=1&par2=accent" csrftoken="mytokenhere">My content goes here</le-textfield>
  <!-- Add the library before closing the body tag -->
  <script src="js/le-textfield.js"></script>
</body>
```

If we use the new tag to wrap some text it is going to be a normal content in a HTML page

![Image representing normal html tag](https://github.com/fabiomattei/live-edit/blob/main/blob/readme/fieldclosed.png?raw=true)

If we click on that content a form is going to appear that will allow us to edit that content.

![Image representing html form](https://github.com/fabiomattei/live-edit/blob/main/blob/readme/fieldopen.png?raw=true)


### To work on it using PHP integrated server

php -S localhost:8080

### USAGES

If you run a web-server and point your browser to index.html you can see a number of examples.



