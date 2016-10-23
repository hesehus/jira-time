/**
* Prevent all drag and drop defaults in the browser, since
* we will handle it ourself when Jira links are dropped
**/
export default function stopDrops () {
  ['drag',
  'dragend',
  'dragenter',
  'dragexit',
  'dragleave',
  'dragover',
  'dragstart',
  'drop'].forEach(name => document.addEventListener(name, e => e.preventDefault(), false));
}
