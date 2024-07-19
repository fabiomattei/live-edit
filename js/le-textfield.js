console.log("caricato")

class LeTextField extends HTMLElement {
	
  constructor() {
    super();
    // element created
    this.isFormActive = false;
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    this.shadow = this.attachShadow({mode: 'open'});

    this.render();
  }

  render() {
    const visibleShadow = '<span id="'+this.getAttribute("id")+'">'+this.innerHTML+'</span>';
    const formShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'"><input type="hidden" id="token"  name="token" value="'+this.getAttribute("id")+'"><input type="text" id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" value="'+this.innerHTML+'"><button id="'+this.getAttribute("id")+'bid">Ok</button></form>';

    if (!this.isFormActive) {
        this.shadow.innerHTML = visibleShadow;

        const visiblepart = this.shadow.getElementById(this.getAttribute("id"));
        visiblepart.addEventListener('click', () => {
          console.log("cliccato")
          this.isFormActive = true
          this.render();
        });
    } else {
        this.shadow.innerHTML = formShadow;

        const formButton = this.shadow.getElementById(this.getAttribute("id")+'bid');
        formButton.addEventListener('click', evt => {
          evt.preventDefault()
          evt.stopImmediatePropagation();
          console.log("cliccato bottone")

          const formToken = this.shadow.getElementById('token');
          const formField = this.shadow.getElementById(this.getAttribute("id")+'fid');

          let urlParams = new URLSearchParams(this.getAttribute("parameters"));
          let formattedFormData = new URLSearchParams()
          for(const entry of urlParams.entries()) {
            formattedFormData.append(entry[0], entry[1]);
            // console.log(entry[0]+':'+entry[1])
          }
          formattedFormData.append('value', formField.value);
          formattedFormData.append('token', formToken.value);

          let urlToCall = this.getAttribute("action")
          const fetchOptions = {}
          if ( this.getAttribute("method") == null || this.getAttribute("method") === 'GET' || this.getAttribute("method") === 'get' || this.getAttribute("method") === 'Get' ) {
            fetchOptions.method = 'GET'
            fetchOptions.headers = { 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8" }
            urlToCall += "?" + formattedFormData.toString()
          } else {
            fetchOptions.method = 'POST'
            fetchOptions.headers = { 'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8" }
            fetchOptions.body = formattedFormData
          }

          // fetch Text or HTML
          fetch(urlToCall, fetchOptions)
            .then( response => {
              console.log("response")
              return response.text()
            }).then( htmlcode => {
              console.log("htmlcode")
              console.log(htmlcode)
              this.innerHTML = htmlcode
              this.isFormActive = false
              this.render();

            }).catch(err => {
              console.warn('Something went wrong in udbuttonempty.', err)
            })

          this.isFormActive = false
          this.render();
        });
    }
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return [/* array of attribute names to monitor for changes */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

}


customElements.define("le-textfield", LeTextField);

