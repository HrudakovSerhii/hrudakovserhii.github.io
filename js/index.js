/**
 * EmailInput function to hold/add/remove email address strings
 *
 * Function create email items using initial value and input functionality.
 * Use API functions to get access to content from EmailInput.
 *
 * @param {DocumentFragment}  parentNode        EmailInput container element
 * @param {Function} onChange                   Event handler to catch Emails list updates
 * @param {string}   value                      Initial value of Emails list. Should contain email addresses divided by comma (email@one.com,email@two.com...)
 * @param {string}   className                  Custom style name of EmailInput root view
 * @param {string}   validEmailItemClassName    Custom style name of valid email item view
 * @param {string}   invalidEmailItemClassName  Custom style for invalid email item view
 * @param {string}   removeButtonClassName      Custom style name of email item remove button view
 * @param {string}   inputClassName             Custom style name of email item remove button view
 * @param {string}   inputPlaceHolder           Input field placeHolder Custom style name of email item remove button view
 *
 * @return {
 *    {
 *       addEmail:      (function(email:string): void),
 *       getEmails:     (function(): string[]),
 *       getEmailCount: (function(): number),
 *       el:            HTMLDivElement
 *    }
 * } {
 *       addEmail:      add new Emails in a list,
 *       getEmails:     return emails string array
 *       getEmailCount: return emails count number
 *       el:            return EmailInput element reference
 *   }
 */

function EmailsInput(
    parentNode,
    onChange,
    value = "",
    className = "",
    validEmailItemClassName = "",
    invalidEmailItemClassName = "",
    removeButtonClassName = "",
    inputClassName = "",
    inputPlaceHolder = ""
) {
   if (typeof window === "undefined") return undefined;
   else
      window.addEventListener("load", () => {
         if (!parentNode.hasChildNodes()) init(value);
      });

   var _counter = 0;
   var _emailsList = [];

   var inputField = window.document.createElement("div");

   var _emailItemTemplate =
       `<div class="email--item email--item-valid ` +
       validEmailItemClassName +
       `">
        <span></span>
        <button class="button--email-item-remove ` +
       removeButtonClassName +
       `">
           <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="#050038" />
           </svg>
        </button>
     </div>`;

   var _newEmailItemTemplate =
       `<div class="email--item email--item-new ` +
       inputClassName +
       `">
        <input class="email-input--item-new" type="email" placeholder="` +
       inputPlaceHolder +
       `" value="" />
     </div>`;

   var emailRegexp = /(?!.*\.{2})^([A-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[A-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/;

   var getElByTemplate = function (template, id) {
      var templateEl = window.document.createElement("template");
      templateEl.setAttribute("style", "display:none");
      templateEl.setAttribute("id", id.toString());

      templateEl.innerHTML = template;

      return templateEl.content;
   };

   var addEmails = function (emailsString) {
      var emails = emailsString.split(",");

      for (var i = 0; i < emails.length; i += 1) {
         var email = emails[i].trim();

         if (email?.length) {
            if (!_emailsList.find((d) => d === email)) {
               addEmailBlock(email);

               _emailsList.push(email);

               onChange && onChange(_emailsList);
            } else {
               showError(`Email ${email} already exist in board`);
            }
         }
      }
   };

   var onRemoveEmail = function (e) {
      var emailToRemove = e.target.parentNode.querySelector(".email--item span").textContent;

      _emailsList = _emailsList.filter((email) => email !== emailToRemove);

      e.target.removeEventListener("click", this);
      e.target.parentNode.remove();

      onChange && onChange(_emailsList);
   };

   var addEmailBlock = function (email) {
      var isInvalid = !emailRegexp.test(email);
      var emailBlock = getEmailBlockNode(email);

      if (isInvalid) {
         emailBlock.querySelector(".email--item").className += ` email--item-invalid ${invalidEmailItemClassName}`;
      }

      inputField.insertBefore(emailBlock, inputField.querySelector(".email--item-new"));
   };

   var showError = function (error) {
      alert(error);
   };

   // Catch ,(comma) and Enter keys press and create new emailBlocks
   var onKeyPress = function (e) {
      e.stopPropagation();

      var value = e.target.value;

      if (e.key === "," || e.key === "Enter") {
         if (value.length > 1) {
            addEmails(value);

            e.currentTarget.value = "";
         } else if (e.key === "," && !value.length) {
            showError("Email can't start with `,` character");
         }
      }
   };

   // ivan@mail.ru, max@mail.ru
   // Handle paste event on input
   var onTextInput = function (e) {
      var value = e.target.value;

      if (value.includes(",")) {
         if (value.length > 1) addEmails(value);
         else e.currentTarget.value = "";

         e.currentTarget.value = "";
      }
   };

   // Create new emailBlocks if any text left in email input
   var onFocusOut = function (e) {
      e.stopPropagation();

      var value = e.target.value;

      if (value.length) addEmails(value);

      e.currentTarget.value = "";
   };

   var getEmailBlockNode = function (email) {
      var id = (_counter += 1);
      var newEmailNode = getElByTemplate(_emailItemTemplate, id);

      newEmailNode.querySelector(".email--item span").textContent = email;
      newEmailNode.querySelector(".email--item").setAttribute("key", id.toString());
      newEmailNode.querySelector(".email--item .button--email-item-remove").addEventListener("click", onRemoveEmail);

      return newEmailNode;
   };

   var focusOnInput = function (e) {
      if (e.target.className.includes("emails-list")) e.target.querySelector(".email-input--item-new").focus();
   };

   var init = function (initEmails) {
      inputField.setAttribute("class", `emails-list ${className}`);
      inputField.addEventListener("click", focusOnInput);

      var newEmailInputNode = getElByTemplate(_newEmailItemTemplate, "email-input-el");
      var newEmailInputNodeInput = newEmailInputNode.querySelector(".email-input--item-new");

      newEmailInputNodeInput.addEventListener("keydown", onKeyPress);
      newEmailInputNodeInput.addEventListener("input", onTextInput);
      newEmailInputNodeInput.addEventListener("focusout", onFocusOut);

      inputField.append(newEmailInputNode);
      parentNode.append(inputField);

      addEmails(initEmails);
   };

   init(value);

   return {
      el: inputField,
      addEmail: addEmails,
      getEmailCount: () => _emailsList.length,
      getEmails: () => _emailsList
   };
}

if (typeof module !== "undefined") module.exports = EmailsInput;
