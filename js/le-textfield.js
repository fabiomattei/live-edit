
class LeEditable extends HTMLElement {

  connectedCallback() {
    this.isFormActive = false;
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    this.shadow = this.attachShadow({mode: 'open'});

    this.render();
  }

  render() {
    const visibleShadow = '<span id="'+this.getAttribute("id")+'">'+this.innerHTML+'</span>';
    const formShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'"><input type="'+(this.getAttribute("type") ?? 'text' )+'" id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" value="'+this.innerHTML+'"><button id="'+this.getAttribute("id")+'bid">Ok</button></form>';
    const formTextAreaShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'"><textarea id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname">'+this.innerHTML+'</textarea><button id="'+this.getAttribute("id")+'bid">Ok</button></form>';
    const formSelectShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'"><select id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" value="'+this.innerHTML+'"></select><button id="'+this.getAttribute("id")+'bid">Ok</button></form>';

    if (!this.isFormActive) {
        this.shadow.innerHTML = visibleShadow;

        const visiblepart = this.shadow.getElementById(this.getAttribute("id"));
        visiblepart.addEventListener('click', () => {
          this.isFormActive = true
          this.render();
        });
    } else {
        if ( this.hasAttribute('type') && this.getAttribute('type') === 'textarea' ) {
          this.shadow.innerHTML = formTextAreaShadow;
        } else if ( this.hasAttribute('type') && this.getAttribute('type') === 'select' ) {
          this.shadow.innerHTML = formSelectShadow;
          const select = this.shadow.getElementById(this.getAttribute("id") + 'fid');
          if ( this.hasAttribute('data') ) {
            const optionsList = JSON.parse(this.getAttribute('data'));
            for (var i = 0; i < optionsList.length; i++){
              var opt = document.createElement('option');
              opt.value = optionsList[i][0];
              opt.innerHTML = optionsList[i][1];
              select.appendChild(opt);
            }
          } else if ( this.hasAttribute('dataurl') ) {
            fetch(this.getAttribute('dataurl'))
                .then(response => {
                  return response.text()
                }).then( htmlcode => {
              const optionsList = JSON.parse(htmlcode);
              for (var i = 0; i < optionsList.length; i++){
                var opt = document.createElement('option');
                opt.value = optionsList[i][0];
                opt.innerHTML = optionsList[i][1];
                select.appendChild(opt);
              }
            }).catch(err => {
              console.warn('Something went wrong: ', err)
            })
          } else {
            console.log("no data attribute set")
          }
        } else {
          this.shadow.innerHTML = formShadow;
        }


        const formButton = this.shadow.getElementById(this.getAttribute("id")+'bid');
        formButton.addEventListener('click', evt => {
          evt.preventDefault()
          evt.stopImmediatePropagation();

          this.sendDataToApi();

          this.isFormActive = false
          this.render();
        });
    }
  }

  sendDataToApi() {
    const formField = this.shadow.getElementById(this.getAttribute("id") + 'fid');

    let urlParams = new URLSearchParams(this.getAttribute("parameters"));
    let formattedFormData = new URLSearchParams()
    for (const entry of urlParams.entries()) {
      formattedFormData.append(entry[0], entry[1]);
      // console.log(entry[0]+':'+entry[1])
    }
    formattedFormData.append('value', formField.value);
    if (this.hasAttribute('function')) { formattedFormData.append('function', this.getAttribute('function' ) ) }
    if (this.hasAttribute('token')) { formattedFormData.append('token', this.getAttribute('token' ) ) }

    let urlToCall = this.getAttribute("action")
    const fetchOptions = {}
    if (this.getAttribute("method") == null || this.getAttribute("method") === 'GET' || this.getAttribute("method") === 'get' || this.getAttribute("method") === 'Get') {
      fetchOptions.method = 'GET'
      fetchOptions.headers = {'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"}
      urlToCall += "?" + formattedFormData.toString()
    } else {
      fetchOptions.method = 'POST'
      fetchOptions.headers = {'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8"}
      fetchOptions.body = formattedFormData
    }

    // fetch Text or HTML
    fetch(urlToCall, fetchOptions)
        .then(response => {
          return response.text()
        }).then(htmlcode => {
      this.innerHTML = htmlcode
      this.isFormActive = false
      this.render();

    }).catch(err => {
      console.warn('Something went wrong: ', err)
    })
  }

}


customElements.define("le-editable", LeEditable);
