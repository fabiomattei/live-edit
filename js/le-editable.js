# Copyright (C) 19/04/2025 Fabio Mattei
# This file is part of live-edit <https://github.com/fabiomattei/live-edit>.
#
# live-edit is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# live-edit is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with live-edit.  If not, see <http://www.gnu.org/licenses/>.

class LeEditable extends HTMLElement {

  connectedCallback() {
    this.isFormActive = false
    this.initialContent = this.innerHTML
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
    this.shadow = this.attachShadow({mode: 'open'})

    this.render()
  }

  /**
   * Transforms a date from this format: 2025-04-19
   * to a date in this format: 19/04/2025
   *
   * Remember
   * match[3],  // year
   * match[2],  // monthIndex
   * match[1]  // day
   *
   * @param myDate
   * @returns {string}
   */
  formatDateFromISOToEuropean(myDate) {
    let dateParser = /(\d{2})\/(\d{2})\/(\d{4})/;
    let match = myDate.match(dateParser);
    return String(match[3]).padStart(2,"0")+'-'+String(match[2]).padStart(2,"0")+'-'+match[1];
  }

  /**
   * Transforms a date from this format: 19/04/2025
   * to a date in this format: 2025-04-19
   *
   * Remember
   * match[3],  // year
   * match[2],  // monthIndex
   * match[1]  // day
   *
   * @param myDate
   * @returns {string}
   */
  formatDateFromEuropeanToIso(myDate) {
    let dateParser = /(\d{4})-(\d{2})-(\d{2})/;
    let match = myDate.match(dateParser);
    return match[3]+'/'+String(match[2]).padStart(2,"0")+'/'+String(match[1]).padStart(2,"0");
  }

  /**
   * Transforms a date from this format: 2025-04-19 12:30:40
   * to a date in this format: 19/04/2025T12:30:40
   *
   * Remember
   * match[3], // year
   * match[2], // monthIndex
   * match[1]  // day
   * match[4], // hours
   * match[5], // minutes
   * match[6]  //seconds
   *
   * @param myDate
   * @returns {string}
   */
  formatDateTimeFromISOToEuropean(myDate) {
    let dateParser = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
    let match = myDate.match(dateParser);
    return match[3]+'-'+String(match[2]).padStart(2,"0")+'-'+String(match[1]).padStart(2,"0")+'T'+String(match[4]).padStart(2,"0")+':'+String(match[5]).padStart(2,"0");
  }

  /**
   * Transforms a date from this format: 19/04/2025T12:30:40
   * to a date in this format: 2025-04-19 12:30:40
   *
   * Remember
   * match[3], // year
   * match[2], // monthIndex
   * match[1]  // day
   * match[4], // hours
   * match[5], // minutes
   * match[6]  //seconds
   *
   * @param myDate
   * @returns {string}
   */
  formatDateTimeFromISOToEuropean(myDate) {
    let dateParser = /(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2}):(\d{2})/;
    let match = myDate.match(dateParser);
    return match[3]+'-'+String(match[2]).padStart(2,"0")+'-'+String(match[1]).padStart(2,"0")+' '+String(match[4]).padStart(2,"0")+':'+String(match[5]).padStart(2,"0");
  }

  render() {
    const okclass = ( this.hasAttribute("okclass") ? 'okclass="'+this.getAttribute("okclass")+'"' : '' )
    const oktext = ( this.hasAttribute("oktext") ? this.getAttribute("oktext") : 'Ok' )
    const okbutton = '<button id="'+this.getAttribute("id")+'bid" '+okclass+'>'+oktext+'</button>'
    
    const cancelclass = ( this.hasAttribute("cancelclass") ? 'okclass="'+this.getAttribute("cancelclass")+'"' : '' )
    const canceltext = ( this.hasAttribute("canceltext") ? this.getAttribute("canceltext") : 'cancel' )
    const cancelbutton = ( this.hasAttribute("cancelbutton") ? '<button id="'+this.getAttribute("id")+'cid" '+cancelclass+'>'+canceltext+'</button>' : '' ) 
    
    const visibleShadow = '<span id="'+this.getAttribute("id")+'">'+this.innerHTML+'</span>';
    const formShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'" class="'+(this.getAttribute("formclass") ?? '' )+'"><input type="'+(this.getAttribute("type") ?? 'text' )+'" id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" value="'+this.innerHTML+'" class="'+(this.getAttribute("fieldclass") ?? '' )+'">'+okbutton+cancelbutton+'</form>';
    const formTextAreaShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'" class="'+(this.getAttribute("formclass") ?? '' )+'"><textarea id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" class="'+(this.getAttribute("fieldclass") ?? '' )+'">'+this.innerHTML+'</textarea><br/>'+okbutton+cancelbutton+'</form>';
    const formSelectShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'" class="'+(this.getAttribute("formclass") ?? '' )+'"><select id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" value="'+this.innerHTML+'" class="'+(this.getAttribute("fieldclass") ?? '' )+'"></select>'+okbutton+cancelbutton+'</form>';

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
              if (select.value === opt.value) { opt.selected = true }
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
                if (select.value === opt.value) { opt.selected = true }
                select.appendChild(opt);
              }
            }).catch(err => {
              console.warn('Something went wrong: ', err)
            })
          } else {
            console.log("no data attribute set")
          }
        } else if ( this.hasAttribute('type') && this.getAttribute('type') === 'date' ) { 
          const formDateShadow = '<form action="'+this.getAttribute("action")+'" method="'+this.getAttribute("method")+'" class="'+(this.getAttribute("formclass") ?? '' )+'"><input type="'+(this.getAttribute("type") ?? 'text' )+'" id="'+this.getAttribute("id")+'fid" name="'+this.getAttribute("id")+'fname" value="'+this.formatDateFromISOToEuropean(this.innerHTML)+'" class="'+(this.getAttribute("fieldclass") ?? '' )+'">'+okbutton+cancelbutton+'</form>';
          
          this.shadow.innerHTML = formDateShadow;
        } else {
          this.shadow.innerHTML = formShadow;
        }


        const formOkButton = this.shadow.getElementById(this.getAttribute("id")+'bid');
        formOkButton.addEventListener('click', evt => {
          evt.preventDefault()
          evt.stopImmediatePropagation();

          this.sendDataToApi();

          this.isFormActive = false
          this.render();
        });
        
        if (this.hasAttribute("cancelbutton")) {
          const formCancelButton = this.shadow.getElementById(this.getAttribute("id")+'cid');
          formCancelButton.addEventListener('click', evt => {
            evt.preventDefault()
            evt.stopImmediatePropagation();
          
            this.innerHTML = this.initialContent 
          
            this.isFormActive = false
            this.render();
          });
        }
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
    if (this.hasAttribute('csrftoken')) { formattedFormData.append('csrftoken', this.getAttribute('csrftoken' ) ) }

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
        
        if ( this.hasAttribute('type') && this.getAttribute('type') === 'date' ) {
          let k = this.formatDateFromEuropeanToIso(String(htmlcode))
          this.innerHTML = this.formatDateFromEuropeanToIso(htmlcode)
        } else {
          this.innerHTML = htmlcode
        }
        
        this.isFormActive = false
        this.render();

      }).catch(err => {
        console.warn('Something went wrong: ', err)
      })
  }

}


customElements.define("le-editable", LeEditable);
