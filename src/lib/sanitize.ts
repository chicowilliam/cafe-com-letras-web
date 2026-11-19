import sanitizeHTML from 'sanitize-html';

export function sanitizeRichText(text: string) {
  return sanitizeHTML(String(text), {
    allowedTags: ['p','br','strong','b','em','i','u','s','span','ul','ol','li','a','blockquote'],
    allowedAttributes: { a: ['href','title','target','rel'] },
    allowedSchemes: ['http','https','mailto','tel'], allowProtocolRelative: false,
    transformTags: { a: sanitizeHTML.simpleTransform('a',{rel:'noopener noreferrer'}) },
  });
}
export function sanitizeBody(text: string) {
  return sanitizeHTML(text, {
    allowedTags: [...sanitizeHTML.defaults.allowedTags,'img','input','form','fieldset','legend','textarea','button','select','option','date','time','main','figure','figcaption','h1'],
    allowedAttributes: { '*':['id','class','style','title','role','aria-*','data-*','tabindex','calendar','date'], a:['href','target','rel','download'], img:['src','srcset','sizes','alt','width','height','loading','decoding','fetchpriority','title'], form:['action','method','name','target'],input:['type','value','name','placeholder','required','disabled','id'],fieldset:['disabled'],textarea:['name','placeholder','required','disabled'],button:['type','disabled'],select:['name','disabled'],option:['value','selected'],td:['colspan','rowspan'],th:['colspan','rowspan','scope'] },
    allowedSchemes: ['http','https','mailto','tel'], allowProtocolRelative: false,
    allowedStyles: { '*': { color:[/^[#\w\s(),.%/-]+$/], 'background-color':[/^[#\w\s(),.%/-]+$/], 'background-image':[/^url\(["']?\/[a-zA-Z0-9_./%?=&-]+["']?\)$/], opacity:[/^[0-9.]+$/], display:[/^(none|block|inline|inline-block|flex)$/], overflow:[/^(hidden|visible|auto)$/], position:[/^(absolute|relative|fixed|static)$/], float:[/^(left|right|none)$/], width:[/^[0-9.px% -]+$/],height:[/^[0-9.px% -]+$/],left:[/^[0-9.px% -]+$/],top:[/^[0-9.px% -]+$/],right:[/^[0-9.px% -]+$/],bottom:[/^[0-9.px% -]+$/], 'z-index':[/^[0-9-]+$/], 'margin-left':[/^[0-9.px% -]+$/],margin:[/^[0-9.px% -]+$/], 'padding-top':[/^[0-9.px% -]+$/], 'object-fit':[/^(cover|contain)$/], transform:[/^(translate3d|translateX|translateY|matrix|scale)\([0-9.px%, -]+\)$/], 'transition-duration':[/^[0-9.ms]+$/], 'perspective-origin':[/^[0-9.px% -]+$/], 'transform-origin':[/^[0-9.px% -]+$/] } },
    transformTags: { a: sanitizeHTML.simpleTransform('a',{rel:'noopener noreferrer'}) },
  });
}
