class LeTextField extends HTMLElement {
	
  constructor() {
    super();
    // element created
    this.isFormActive = false;
  }

  const visibleShadow = '<span id="${this.getAttribute("id")">${this.innerHTML}</span>';
  const formShadow = '<form action="" method="">${this.innerHTML}</form>';

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    const shadow = this.attachShadow({mode: 'open'});
    if (!this.isFormActive) {
        shadow.innerHTML = visibleShadow;
    } else {
        shadow.innerHTML = formShadow;
    }

    const pnl = shadow.getElementById(this.getAttribute("id"));
    this.addEventListener('click', () => alert("Hello!"));
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

