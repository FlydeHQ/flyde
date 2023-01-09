"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1993],{35318:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(27378);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),f=l(n),d=i,h=f["".concat(s,".").concat(d)]||f[d]||u[d]||o;return n?r.createElement(h,a(a({ref:t},p),{},{components:n})):r.createElement(h,a({ref:t},p))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:i,a[1]=c;for(var l=2;l<o;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},21937:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return s},default:function(){return d},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return u}});var r=n(52685),i=n(1244),o=(n(27378),n(35318)),a=["components"],c={},s="Lifecycle of a Part",l={unversionedId:"lifecycle",id:"lifecycle",title:"Lifecycle of a Part",description:"A part in Flyde is a self-contained unit of functionality that can be connected to other parts to form a flow. The lifecycle of a part consists of two states: waiting for inputs, and processing.",source:"@site/docs/lifecycle.md",sourceDirName:".",slug:"/lifecycle",permalink:"/docs/lifecycle",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/lifecycle.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Hello World with Flyde",permalink:"/docs/Tutorials/hello-world-with-flyde/"},next:{title:"Flyde Quick Start Guide",permalink:"/docs/quick-start"}},p={},u=[],f={toc:u};function d(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"lifecycle-of-a-part"},"Lifecycle of a Part"),(0,o.kt)("p",null,"A part in Flyde is a self-contained unit of functionality that can be connected to other parts to form a flow. The lifecycle of a part consists of two states: waiting for inputs, and processing."),(0,o.kt)("p",null,"When a part is waiting for inputs, it is waiting for data to be passed to it through its input pins. Once all required input pins have received data, the part will start processing."),(0,o.kt)("p",null,'By default, input pins are "sticky", meaning that each new input will replace the previous one. However, input pins can also be configured to queue up different values in a first-in-first-out (FIFO) manner.'),(0,o.kt)("p",null,'A code part\'s processing is determined by the logic implemented in its fn function. If the fn function returns a promise, the part will be considered "processing" until the promise is either resolved or rejected.'),(0,o.kt)("p",null,'A visual part, on the other hand, is a group of other parts connected together in a "nodes and wires" style. The processing of a visual part is determined by the processing of its child parts.'),(0,o.kt)("p",null,"Once a part has finished processing, it is considered completed. For code parts, completion is determined by the end of the fn function. For visual parts, completion is determined by the completion of all its child parts."),(0,o.kt)("p",null,'In addition to these states, parts can also have completion outputs and reactive inputs. Completion outputs are output pins that, when triggered, signify that the part has completed. If a part does not have any completion outputs, it will be considered completed as soon as no other parts are "processing".'),(0,o.kt)("p",null,"Reactive inputs are input pins that, when triggered, will cause the part to start processing again, even if it is already processing. This can be useful for implementing reactive behavior in a flow."),(0,o.kt)("p",null,"While a part is processing, it can access its internal state through the adv.state object. This state is cleared once the part is completed."),(0,o.kt)("p",null,"It is also possible for a part to report errors by calling the adv.onError function. This can be used to handle unexpected behavior or invalid input in a flow."),(0,o.kt)("p",null,"Finally, a part can specify cleanup logic to be executed when it is completed by calling the adv.onCleanup function. This"))}d.isMDXComponent=!0}}]);