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

    const visibleShadow = '<span id="'+this.getAttribute("id")+'">'+this.innerHTML+'</span>';
    const formShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'"><input type="hidden"  name="token" value="'+this.getAttribute("id")+'"><input type="text" id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" value="'+this.innerHTML+'"><button id="'+this.getAttribute("id")+'bid">Ok</button></form>';

    const shadow = this.attachShadow({mode: 'open'});
    if (!this.isFormActive) {
        shadow.innerHTML = visibleShadow;
    } else {
        shadow.innerHTML = formShadow;
    }

    const visiblepart = shadow.getElementById(this.getAttribute("id"));
    visiblepart.addEventListener('click', () => {
      console.log("cliccato")
      shadow.innerHTML = formShadow;
    });


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

