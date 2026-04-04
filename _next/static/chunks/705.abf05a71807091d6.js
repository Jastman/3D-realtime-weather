"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[705],{125:(e,t,n)=>{var r=n(2115),o="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},i=r.useState,a=r.useEffect,l=r.useLayoutEffect,s=r.useDebugValue;function c(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!o(e,n)}catch(e){return!0}}var u="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=i({inst:{value:n,getSnapshot:t}}),o=r[0].inst,u=r[1];return l(function(){o.value=n,o.getSnapshot=t,c(o)&&u({inst:o})},[e,n,t]),a(function(){return c(o)&&u({inst:o}),e(function(){c(o)&&u({inst:o})})},[e]),s(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:u},258:(e,t,n)=>{n.d(t,{Hl:()=>f});var r=n(264),o=n(2115),i=n(7548);function a(e,t){let n;return(...r)=>{window.clearTimeout(n),n=window.setTimeout(()=>e(...r),t)}}let l=["x","y","top","bottom","left","right","width","height"];var s=n(4735),c=n(5155);function u({ref:e,children:t,fallback:n,resize:s,style:u,gl:f,events:d=r.f,eventSource:m,eventPrefix:h,shadows:p,linear:v,flat:b,legacy:g,orthographic:y,frameloop:w,dpr:E,performance:P,raycaster:x,camera:T,scene:M,onPointerMissed:O,onCreated:S,...j}){o.useMemo(()=>(0,r.e)(i),[]);let C=(0,r.u)(),[_,A]=function({debounce:e,scroll:t,polyfill:n,offsetSize:r}={debounce:0,scroll:!1,offsetSize:!1}){var i,s,c;let u=n||("undefined"==typeof window?class{}:window.ResizeObserver);if(!u)throw Error("This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills");let[f,d]=(0,o.useState)({left:0,top:0,width:0,height:0,bottom:0,right:0,x:0,y:0}),m=(0,o.useRef)({element:null,scrollContainers:null,resizeObserver:null,lastBounds:f,orientationHandler:null}),h=e?"number"==typeof e?e:e.scroll:null,p=e?"number"==typeof e?e:e.resize:null,v=(0,o.useRef)(!1);(0,o.useEffect)(()=>(v.current=!0,()=>void(v.current=!1)));let[b,g,y]=(0,o.useMemo)(()=>{let e=()=>{let e,t;if(!m.current.element)return;let{left:n,top:o,width:i,height:a,bottom:s,right:c,x:u,y:f}=m.current.element.getBoundingClientRect(),h={left:n,top:o,width:i,height:a,bottom:s,right:c,x:u,y:f};m.current.element instanceof HTMLElement&&r&&(h.height=m.current.element.offsetHeight,h.width=m.current.element.offsetWidth),Object.freeze(h),v.current&&(e=m.current.lastBounds,t=h,!l.every(n=>e[n]===t[n]))&&d(m.current.lastBounds=h)};return[e,p?a(e,p):e,h?a(e,h):e]},[d,r,h,p]);function w(){m.current.scrollContainers&&(m.current.scrollContainers.forEach(e=>e.removeEventListener("scroll",y,!0)),m.current.scrollContainers=null),m.current.resizeObserver&&(m.current.resizeObserver.disconnect(),m.current.resizeObserver=null),m.current.orientationHandler&&("orientation"in screen&&"removeEventListener"in screen.orientation?screen.orientation.removeEventListener("change",m.current.orientationHandler):"onorientationchange"in window&&window.removeEventListener("orientationchange",m.current.orientationHandler))}function E(){m.current.element&&(m.current.resizeObserver=new u(y),m.current.resizeObserver.observe(m.current.element),t&&m.current.scrollContainers&&m.current.scrollContainers.forEach(e=>e.addEventListener("scroll",y,{capture:!0,passive:!0})),m.current.orientationHandler=()=>{y()},"orientation"in screen&&"addEventListener"in screen.orientation?screen.orientation.addEventListener("change",m.current.orientationHandler):"onorientationchange"in window&&window.addEventListener("orientationchange",m.current.orientationHandler))}return i=y,s=!!t,(0,o.useEffect)(()=>{if(s)return window.addEventListener("scroll",i,{capture:!0,passive:!0}),()=>void window.removeEventListener("scroll",i,!0)},[i,s]),c=g,(0,o.useEffect)(()=>(window.addEventListener("resize",c),()=>void window.removeEventListener("resize",c)),[c]),(0,o.useEffect)(()=>{w(),E()},[t,y,g]),(0,o.useEffect)(()=>w,[]),[e=>{e&&e!==m.current.element&&(w(),m.current.element=e,m.current.scrollContainers=function e(t){let n=[];if(!t||t===document.body)return n;let{overflow:r,overflowX:o,overflowY:i}=window.getComputedStyle(t);return[r,o,i].some(e=>"auto"===e||"scroll"===e)&&n.push(t),[...n,...e(t.parentElement)]}(e),E())},f,b]}({scroll:!0,debounce:{scroll:50,resize:0},...s}),L=o.useRef(null),R=o.useRef(null);o.useImperativeHandle(e,()=>L.current);let I=(0,r.a)(O),[k,z]=o.useState(!1),[D,N]=o.useState(!1);if(k)throw k;if(D)throw D;let Y=o.useRef(null);(0,r.b)(()=>{let e=L.current;A.width>0&&A.height>0&&e&&(Y.current||(Y.current=(0,r.c)(e)),async function(){await Y.current.configure({gl:f,scene:M,events:d,shadows:p,linear:v,flat:b,legacy:g,orthographic:y,frameloop:w,dpr:E,performance:P,raycaster:x,camera:T,size:A,onPointerMissed:(...e)=>null==I.current?void 0:I.current(...e),onCreated:e=>{null==e.events.connect||e.events.connect(m?(0,r.i)(m)?m.current:m:R.current),h&&e.setEvents({compute:(e,t)=>{let n=e[h+"X"],r=e[h+"Y"];t.pointer.set(n/t.size.width*2-1,-(2*(r/t.size.height))+1),t.raycaster.setFromCamera(t.pointer,t.camera)}}),null==S||S(e)}}),Y.current.render((0,c.jsx)(C,{children:(0,c.jsx)(r.E,{set:N,children:(0,c.jsx)(o.Suspense,{fallback:(0,c.jsx)(r.B,{set:z}),children:null!=t?t:null})})}))}())}),o.useEffect(()=>{let e=L.current;if(e)return()=>(0,r.d)(e)},[]);let F=m?"none":"auto";return(0,c.jsx)("div",{ref:R,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",pointerEvents:F,...u},...j,children:(0,c.jsx)("div",{ref:_,style:{width:"100%",height:"100%"},children:(0,c.jsx)("canvas",{ref:L,style:{display:"block"},children:n})})})}function f(e){return(0,c.jsx)(s.Af,{children:(0,c.jsx)(u,{...e})})}n(9914)},1673:(e,t,n)=>{n.d(t,{M:()=>a});var r=n(5339),o=n(2115),i=n(264);function a({all:e,scene:t,camera:n}){let a=(0,i.C)(({gl:e})=>e),l=(0,i.C)(({camera:e})=>e),s=(0,i.C)(({scene:e})=>e);return o.useLayoutEffect(()=>{let o=[];e&&(t||s).traverse(e=>{!1===e.visible&&(o.push(e),e.visible=!0)}),a.compile(t||s,n||l);let i=new r.o6l(128);new r.F1T(.01,1e5,i).update(a,t||s),i.dispose(),o.forEach(e=>e.visible=!1)},[]),null}},1847:(e,t,n)=>{n.d(t,{r:()=>b});var r=n(8945),o=n(264),i=n(2115),a=n(5339),l=Object.defineProperty;class s{constructor(){((e,t,n)=>((e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,n))(this,"_listeners")}addEventListener(e,t){void 0===this._listeners&&(this._listeners={});let n=this._listeners;void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(t)&&n[e].push(t)}hasEventListener(e,t){if(void 0===this._listeners)return!1;let n=this._listeners;return void 0!==n[e]&&-1!==n[e].indexOf(t)}removeEventListener(e,t){if(void 0===this._listeners)return;let n=this._listeners[e];if(void 0!==n){let e=n.indexOf(t);-1!==e&&n.splice(e,1)}}dispatchEvent(e){if(void 0===this._listeners)return;let t=this._listeners[e.type];if(void 0!==t){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}}var c=Object.defineProperty,u=(e,t,n)=>(((e,t,n)=>t in e?c(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,n),n);let f=new a.RlV,d=new a.Zcv,m=Math.cos(Math.PI/180*70),h=(e,t)=>(e%t+t)%t;class p extends s{constructor(e,t){super(),u(this,"object"),u(this,"domElement"),u(this,"enabled",!0),u(this,"target",new a.Pq0),u(this,"minDistance",0),u(this,"maxDistance",1/0),u(this,"minZoom",0),u(this,"maxZoom",1/0),u(this,"minPolarAngle",0),u(this,"maxPolarAngle",Math.PI),u(this,"minAzimuthAngle",-1/0),u(this,"maxAzimuthAngle",1/0),u(this,"enableDamping",!1),u(this,"dampingFactor",.05),u(this,"enableZoom",!0),u(this,"zoomSpeed",1),u(this,"enableRotate",!0),u(this,"rotateSpeed",1),u(this,"enablePan",!0),u(this,"panSpeed",1),u(this,"screenSpacePanning",!0),u(this,"keyPanSpeed",7),u(this,"zoomToCursor",!1),u(this,"autoRotate",!1),u(this,"autoRotateSpeed",2),u(this,"reverseOrbit",!1),u(this,"reverseHorizontalOrbit",!1),u(this,"reverseVerticalOrbit",!1),u(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),u(this,"mouseButtons",{LEFT:a.kBv.ROTATE,MIDDLE:a.kBv.DOLLY,RIGHT:a.kBv.PAN}),u(this,"touches",{ONE:a.wtR.ROTATE,TWO:a.wtR.DOLLY_PAN}),u(this,"target0"),u(this,"position0"),u(this,"zoom0"),u(this,"_domElementKeyEvents",null),u(this,"getPolarAngle"),u(this,"getAzimuthalAngle"),u(this,"setPolarAngle"),u(this,"setAzimuthalAngle"),u(this,"getDistance"),u(this,"getZoomScale"),u(this,"listenToKeyEvents"),u(this,"stopListenToKeyEvents"),u(this,"saveState"),u(this,"reset"),u(this,"update"),u(this,"connect"),u(this,"dispose"),u(this,"dollyIn"),u(this,"dollyOut"),u(this,"getScale"),u(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>p.phi,this.getAzimuthalAngle=()=>p.theta,this.setPolarAngle=e=>{let t=h(e,2*Math.PI),r=p.phi;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let o=Math.abs(t-r);2*Math.PI-o<o&&(t<r?t+=2*Math.PI:r+=2*Math.PI),v.phi=t-r,n.update()},this.setAzimuthalAngle=e=>{let t=h(e,2*Math.PI),r=p.theta;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let o=Math.abs(t-r);2*Math.PI-o<o&&(t<r?t+=2*Math.PI:r+=2*Math.PI),v.theta=t-r,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=e=>{e.addEventListener("keydown",ee),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ee),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(r),n.update(),s=l.NONE},this.update=(()=>{let t=new a.Pq0,o=new a.Pq0(0,1,0),i=new a.PTz().setFromUnitVectors(e.up,o),u=i.clone().invert(),h=new a.Pq0,y=new a.PTz,w=2*Math.PI;return function(){let E=n.object.position;i.setFromUnitVectors(e.up,o),u.copy(i).invert(),t.copy(E).sub(n.target),t.applyQuaternion(i),p.setFromVector3(t),n.autoRotate&&s===l.NONE&&I(2*Math.PI/60/60*n.autoRotateSpeed),n.enableDamping?(p.theta+=v.theta*n.dampingFactor,p.phi+=v.phi*n.dampingFactor):(p.theta+=v.theta,p.phi+=v.phi);let P=n.minAzimuthAngle,x=n.maxAzimuthAngle;isFinite(P)&&isFinite(x)&&(P<-Math.PI?P+=w:P>Math.PI&&(P-=w),x<-Math.PI?x+=w:x>Math.PI&&(x-=w),P<=x?p.theta=Math.max(P,Math.min(x,p.theta)):p.theta=p.theta>(P+x)/2?Math.max(P,p.theta):Math.min(x,p.theta)),p.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,p.phi)),p.makeSafe(),!0===n.enableDamping?n.target.addScaledVector(g,n.dampingFactor):n.target.add(g),n.zoomToCursor&&_||n.object.isOrthographicCamera?p.radius=B(p.radius):p.radius=B(p.radius*b),t.setFromSpherical(p),t.applyQuaternion(u),E.copy(n.target).add(t),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),!0===n.enableDamping?(v.theta*=1-n.dampingFactor,v.phi*=1-n.dampingFactor,g.multiplyScalar(1-n.dampingFactor)):(v.set(0,0,0),g.set(0,0,0));let T=!1;if(n.zoomToCursor&&_){let r=null;if(n.object instanceof a.ubm&&n.object.isPerspectiveCamera){let e=t.length();r=B(e*b);let o=e-r;n.object.position.addScaledVector(j,o),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let e=new a.Pq0(C.x,C.y,0);e.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/b)),n.object.updateProjectionMatrix(),T=!0;let o=new a.Pq0(C.x,C.y,0);o.unproject(n.object),n.object.position.sub(o).add(e),n.object.updateMatrixWorld(),r=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;null!==r&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(r).add(n.object.position):(f.origin.copy(n.object.position),f.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(f.direction))<m?e.lookAt(n.target):(d.setFromNormalAndCoplanarPoint(n.object.up,n.target),f.intersectPlane(d,n.target))))}else n.object instanceof a.qUd&&n.object.isOrthographicCamera&&(T=1!==b)&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/b)),n.object.updateProjectionMatrix());return b=1,_=!1,!!(T||h.distanceToSquared(n.object.position)>c||8*(1-y.dot(n.object.quaternion))>c)&&(n.dispatchEvent(r),h.copy(n.object.position),y.copy(n.object.quaternion),T=!1,!0)}})(),this.connect=e=>{n.domElement=e,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",et),n.domElement.addEventListener("pointerdown",G),n.domElement.addEventListener("pointercancel",Q),n.domElement.addEventListener("wheel",J)},this.dispose=()=>{var e,t,r,o,i,a;n.domElement&&(n.domElement.style.touchAction="auto"),null==(e=n.domElement)||e.removeEventListener("contextmenu",et),null==(t=n.domElement)||t.removeEventListener("pointerdown",G),null==(r=n.domElement)||r.removeEventListener("pointercancel",Q),null==(o=n.domElement)||o.removeEventListener("wheel",J),null==(i=n.domElement)||i.ownerDocument.removeEventListener("pointermove",$),null==(a=n.domElement)||a.ownerDocument.removeEventListener("pointerup",Q),null!==n._domElementKeyEvents&&n._domElementKeyEvents.removeEventListener("keydown",ee)};let n=this,r={type:"change"},o={type:"start"},i={type:"end"},l={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},s=l.NONE,c=1e-6,p=new a.YHV,v=new a.YHV,b=1,g=new a.Pq0,y=new a.I9Y,w=new a.I9Y,E=new a.I9Y,P=new a.I9Y,x=new a.I9Y,T=new a.I9Y,M=new a.I9Y,O=new a.I9Y,S=new a.I9Y,j=new a.Pq0,C=new a.I9Y,_=!1,A=[],L={};function R(){return Math.pow(.95,n.zoomSpeed)}function I(e){n.reverseOrbit||n.reverseHorizontalOrbit?v.theta+=e:v.theta-=e}function k(e){n.reverseOrbit||n.reverseVerticalOrbit?v.phi+=e:v.phi-=e}let z=(()=>{let e=new a.Pq0;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),g.add(e)}})(),D=(()=>{let e=new a.Pq0;return function(t,r){!0===n.screenSpacePanning?e.setFromMatrixColumn(r,1):(e.setFromMatrixColumn(r,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),g.add(e)}})(),N=(()=>{let e=new a.Pq0;return function(t,r){let o=n.domElement;if(o&&n.object instanceof a.ubm&&n.object.isPerspectiveCamera){let i=n.object.position;e.copy(i).sub(n.target);let a=e.length();z(2*t*(a*=Math.tan(n.object.fov/2*Math.PI/180))/o.clientHeight,n.object.matrix),D(2*r*a/o.clientHeight,n.object.matrix)}else o&&n.object instanceof a.qUd&&n.object.isOrthographicCamera?(z(t*(n.object.right-n.object.left)/n.object.zoom/o.clientWidth,n.object.matrix),D(r*(n.object.top-n.object.bottom)/n.object.zoom/o.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function Y(e){n.object instanceof a.ubm&&n.object.isPerspectiveCamera||n.object instanceof a.qUd&&n.object.isOrthographicCamera?b=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function F(e){if(!n.zoomToCursor||!n.domElement)return;_=!0;let t=n.domElement.getBoundingClientRect(),r=e.clientX-t.left,o=e.clientY-t.top,i=t.width,a=t.height;C.x=r/i*2-1,C.y=-(o/a*2)+1,j.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function B(e){return Math.max(n.minDistance,Math.min(n.maxDistance,e))}function H(e){y.set(e.clientX,e.clientY)}function q(e){P.set(e.clientX,e.clientY)}function V(){if(1==A.length)y.set(A[0].pageX,A[0].pageY);else{let e=.5*(A[0].pageX+A[1].pageX),t=.5*(A[0].pageY+A[1].pageY);y.set(e,t)}}function X(){if(1==A.length)P.set(A[0].pageX,A[0].pageY);else{let e=.5*(A[0].pageX+A[1].pageX),t=.5*(A[0].pageY+A[1].pageY);P.set(e,t)}}function U(){let e=A[0].pageX-A[1].pageX,t=A[0].pageY-A[1].pageY,n=Math.sqrt(e*e+t*t);M.set(0,n)}function Z(e){if(1==A.length)w.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);w.set(n,r)}E.subVectors(w,y).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(I(2*Math.PI*E.x/t.clientHeight),k(2*Math.PI*E.y/t.clientHeight)),y.copy(w)}function K(e){if(1==A.length)x.set(e.pageX,e.pageY);else{let t=er(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);x.set(n,r)}T.subVectors(x,P).multiplyScalar(n.panSpeed),N(T.x,T.y),P.copy(x)}function W(e){var t;let r=er(e),o=e.pageX-r.x,i=e.pageY-r.y,a=Math.sqrt(o*o+i*i);O.set(0,a),S.set(0,Math.pow(O.y/M.y,n.zoomSpeed)),t=S.y,Y(b/t),M.copy(O)}function G(e){var t,r,i;!1!==n.enabled&&(0===A.length&&(null==(t=n.domElement)||t.ownerDocument.addEventListener("pointermove",$),null==(r=n.domElement)||r.ownerDocument.addEventListener("pointerup",Q)),i=e,A.push(i),"touch"===e.pointerType?function(e){switch(en(e),A.length){case 1:switch(n.touches.ONE){case a.wtR.ROTATE:if(!1===n.enableRotate)return;V(),s=l.TOUCH_ROTATE;break;case a.wtR.PAN:if(!1===n.enablePan)return;X(),s=l.TOUCH_PAN;break;default:s=l.NONE}break;case 2:switch(n.touches.TWO){case a.wtR.DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&U(),n.enablePan&&X(),s=l.TOUCH_DOLLY_PAN;break;case a.wtR.DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&U(),n.enableRotate&&V(),s=l.TOUCH_DOLLY_ROTATE;break;default:s=l.NONE}break;default:s=l.NONE}s!==l.NONE&&n.dispatchEvent(o)}(e):function(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case a.kBv.DOLLY:if(!1===n.enableZoom)return;F(e),M.set(e.clientX,e.clientY),s=l.DOLLY;break;case a.kBv.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enablePan)return;q(e),s=l.PAN}else{if(!1===n.enableRotate)return;H(e),s=l.ROTATE}break;case a.kBv.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enableRotate)return;H(e),s=l.ROTATE}else{if(!1===n.enablePan)return;q(e),s=l.PAN}break;default:s=l.NONE}s!==l.NONE&&n.dispatchEvent(o)}(e))}function $(e){!1!==n.enabled&&("touch"===e.pointerType?function(e){switch(en(e),s){case l.TOUCH_ROTATE:if(!1===n.enableRotate)return;Z(e),n.update();break;case l.TOUCH_PAN:if(!1===n.enablePan)return;K(e),n.update();break;case l.TOUCH_DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&W(e),n.enablePan&&K(e),n.update();break;case l.TOUCH_DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&W(e),n.enableRotate&&Z(e),n.update();break;default:s=l.NONE}}(e):function(e){if(!1!==n.enabled)switch(s){case l.ROTATE:if(!1===n.enableRotate)return;w.set(e.clientX,e.clientY),E.subVectors(w,y).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(I(2*Math.PI*E.x/t.clientHeight),k(2*Math.PI*E.y/t.clientHeight)),y.copy(w),n.update();break;case l.DOLLY:var r,o;if(!1===n.enableZoom)return;(O.set(e.clientX,e.clientY),S.subVectors(O,M),S.y>0)?(r=R(),Y(b/r)):S.y<0&&(o=R(),Y(b*o)),M.copy(O),n.update();break;case l.PAN:if(!1===n.enablePan)return;x.set(e.clientX,e.clientY),T.subVectors(x,P).multiplyScalar(n.panSpeed),N(T.x,T.y),P.copy(x),n.update()}}(e))}function Q(e){var t,r,o;(function(e){delete L[e.pointerId];for(let t=0;t<A.length;t++)if(A[t].pointerId==e.pointerId)return void A.splice(t,1)})(e),0===A.length&&(null==(t=n.domElement)||t.releasePointerCapture(e.pointerId),null==(r=n.domElement)||r.ownerDocument.removeEventListener("pointermove",$),null==(o=n.domElement)||o.ownerDocument.removeEventListener("pointerup",Q)),n.dispatchEvent(i),s=l.NONE}function J(e){if(!1!==n.enabled&&!1!==n.enableZoom&&(s===l.NONE||s===l.ROTATE)){var t,r;e.preventDefault(),n.dispatchEvent(o),(F(e),e.deltaY<0)?(t=R(),Y(b*t)):e.deltaY>0&&(r=R(),Y(b/r)),n.update(),n.dispatchEvent(i)}}function ee(e){if(!1!==n.enabled&&!1!==n.enablePan){let t=!1;switch(e.code){case n.keys.UP:N(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:N(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:N(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:N(-n.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),n.update())}}function et(e){!1!==n.enabled&&e.preventDefault()}function en(e){let t=L[e.pointerId];void 0===t&&(t=new a.I9Y,L[e.pointerId]=t),t.set(e.pageX,e.pageY)}function er(e){return L[(e.pointerId===A[0].pointerId?A[1]:A[0]).pointerId]}this.dollyIn=(e=R())=>{Y(b*e),n.update()},this.dollyOut=(e=R())=>{Y(b/e),n.update()},this.getScale=()=>b,this.setScale=e=>{Y(e),n.update()},this.getZoomScale=()=>R(),void 0!==t&&this.connect(t),this.update()}}class v extends p{constructor(e,t){super(e,t),this.screenSpacePanning=!1,this.mouseButtons.LEFT=a.kBv.PAN,this.mouseButtons.RIGHT=a.kBv.ROTATE,this.touches.ONE=a.wtR.PAN,this.touches.TWO=a.wtR.DOLLY_ROTATE}}let b=i.forwardRef((e={enableDamping:!0},t)=>{let{domElement:n,camera:a,makeDefault:l,onChange:s,onStart:c,onEnd:u,...f}=e,d=(0,o.C)(e=>e.invalidate),m=(0,o.C)(e=>e.camera),h=(0,o.C)(e=>e.gl),p=(0,o.C)(e=>e.events),b=(0,o.C)(e=>e.set),g=(0,o.C)(e=>e.get),y=n||p.connected||h.domElement,w=a||m,E=i.useMemo(()=>new v(w),[w]);return i.useEffect(()=>{E.connect(y);let e=e=>{d(),s&&s(e)};return E.addEventListener("change",e),c&&E.addEventListener("start",c),u&&E.addEventListener("end",u),()=>{E.dispose(),E.removeEventListener("change",e),c&&E.removeEventListener("start",c),u&&E.removeEventListener("end",u)}},[s,c,u,E,d,y]),i.useEffect(()=>{if(l){let e=g().controls;return b({controls:E}),()=>b({controls:e})}},[l,E]),(0,o.D)(()=>E.update(),-1),i.createElement("primitive",(0,r.A)({ref:t,object:E,enableDamping:!0},f))})},2912:(e,t,n)=>{n.d(t,{A:()=>c});var r=n(2115),o=n(264),i=n(5339);let a=parseInt(i.sPf.replace(/\D+/g,""));class l extends i.BKk{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${a>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}let s=e=>new i.Pq0().setFromSpherical(new i.YHV(e,Math.acos(1-2*Math.random()),2*Math.random()*Math.PI)),c=r.forwardRef(({radius:e=100,depth:t=50,count:n=5e3,saturation:a=0,factor:c=4,fade:u=!1,speed:f=1},d)=>{let m=r.useRef(null),[h,p,v]=r.useMemo(()=>{let r=[],o=[],l=Array.from({length:n},()=>(.5+.5*Math.random())*c),u=new i.Q1f,f=e+t,d=t/n;for(let e=0;e<n;e++)f-=d*Math.random(),r.push(...s(f).toArray()),u.setHSL(e/n,a,.9),o.push(u.r,u.g,u.b);return[new Float32Array(r),new Float32Array(o),new Float32Array(l)]},[n,t,c,e,a]);(0,o.D)(e=>m.current&&(m.current.uniforms.time.value=e.clock.elapsedTime*f));let[b]=r.useState(()=>new l);return r.createElement("points",{ref:d},r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[h,3]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[p,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[v,1]})),r.createElement("primitive",{ref:m,object:b,attach:"material",blending:i.EZo,"uniforms-fade-value":u,depthWrite:!1,transparent:!0,vertexColors:!0}))})},3580:(e,t,n)=>{n.d(t,{h:()=>s});var r=n(2115),o=n(8828),i=n(490);let{useSyncExternalStoreWithSelector:a}=o,l=(e,t)=>{let n=(0,i.y)(e),o=(e,o=t)=>(function(e,t=e=>e,n){let o=a(e.subscribe,e.getState,e.getInitialState,t,n);return r.useDebugValue(o),o})(n,e,o);return Object.assign(o,n),o},s=(e,t)=>e?l(e,t):l},3617:(e,t,n)=>{n.d(t,{o:()=>o});var r=n(5339);class o{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}new r.qUd(-1,1,1,-1,0,1);class i extends r.LoY{constructor(){super(),this.setAttribute("position",new r.qtW([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new r.qtW([0,2,0,0,2,0],2))}}new i},3654:(e,t,n)=>{var r=n(2115),o=n(4806),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=o.useSyncExternalStore,l=r.useRef,s=r.useEffect,c=r.useMemo,u=r.useDebugValue;t.useSyncExternalStoreWithSelector=function(e,t,n,r,o){var f=l(null);if(null===f.current){var d={hasValue:!1,value:null};f.current=d}else d=f.current;var m=a(e,(f=c(function(){function e(e){if(!s){if(s=!0,a=e,e=r(e),void 0!==o&&d.hasValue){var t=d.value;if(o(t,e))return l=t}return l=e}if(t=l,i(a,e))return t;var n=r(e);return void 0!==o&&o(t,n)?(a=e,t):(a=e,l=n)}var a,l,s=!1,c=void 0===n?null:n;return[function(){return e(t())},null===c?void 0:function(){return e(c())}]},[t,n,r,o]))[0],f[1]);return s(function(){d.hasValue=!0,d.value=m},[m]),u(m),m}},3689:(e,t,n)=>{n.d(t,{DY:()=>a,IU:()=>s,uv:()=>l});let r=[];function o(e,t,n=(e,t)=>e===t){if(e===t)return!0;if(!e||!t)return!1;let r=e.length;if(t.length!==r)return!1;for(let o=0;o<r;o++)if(!n(e[o],t[o]))return!1;return!0}function i(e,t=null,n=!1,a={}){for(let i of(null===t&&(t=[e]),r))if(o(t,i.keys,i.equal)){if(n)return;if(Object.prototype.hasOwnProperty.call(i,"error"))throw i.error;if(Object.prototype.hasOwnProperty.call(i,"response"))return a.lifespan&&a.lifespan>0&&(i.timeout&&clearTimeout(i.timeout),i.timeout=setTimeout(i.remove,a.lifespan)),i.response;if(!n)throw i.promise}let l={keys:t,equal:a.equal,remove:()=>{let e=r.indexOf(l);-1!==e&&r.splice(e,1)},promise:("object"==typeof e&&"function"==typeof e.then?e:e(...t)).then(e=>{l.response=e,a.lifespan&&a.lifespan>0&&(l.timeout=setTimeout(l.remove,a.lifespan))}).catch(e=>l.error=e)};if(r.push(l),!n)throw l.promise}let a=(e,t,n)=>i(e,t,!1,n),l=(e,t,n)=>void i(e,t,!0,n),s=e=>{if(void 0===e||0===e.length)r.splice(0,r.length);else{let t=r.find(t=>o(e,t.keys,t.equal));t&&t.remove()}}},4735:(e,t,n)=>{n.d(t,{Af:()=>l,Nz:()=>o,u5:()=>s,y3:()=>f});var r=n(2115);function o(e,t,n){if(!e)return;if(!0===n(e))return e;let r=t?e.return:e.child;for(;r;){let e=o(r,t,n);if(e)return e;r=t?null:r.sibling}}function i(e){try{return Object.defineProperties(e,{_currentRenderer:{get:()=>null,set(){}},_currentRenderer2:{get:()=>null,set(){}}})}catch(t){return e}}(()=>{var e,t;return"undefined"!=typeof window&&((null==(e=window.document)?void 0:e.createElement)||(null==(t=window.navigator)?void 0:t.product)==="ReactNative")})()?r.useLayoutEffect:r.useEffect;let a=i(r.createContext(null));class l extends r.Component{render(){return r.createElement(a.Provider,{value:this._reactInternals},this.props.children)}}function s(){let e=r.useContext(a);if(null===e)throw Error("its-fine: useFiber must be called within a <FiberProvider />!");let t=r.useId();return r.useMemo(()=>{for(let n of[e,null==e?void 0:e.alternate]){if(!n)continue;let e=o(n,!1,e=>{let n=e.memoizedState;for(;n;){if(n.memoizedState===t)return!0;n=n.next}});if(e)return e}},[e,t])}let c=Symbol.for("react.context"),u=e=>null!==e&&"object"==typeof e&&"$$typeof"in e&&e.$$typeof===c;function f(){let e=function(){let e=s(),[t]=r.useState(()=>new Map);t.clear();let n=e;for(;n;){let e=n.type;u(e)&&e!==a&&!t.has(e)&&t.set(e,r.use(i(e))),n=n.return}return t}();return r.useMemo(()=>Array.from(e.keys()).reduce((t,n)=>o=>r.createElement(t,null,r.createElement(n.Provider,{...o,value:e.get(n)})),e=>r.createElement(l,{...e})),[e])}},4806:(e,t,n)=>{e.exports=n(125)},6451:(e,t)=>{function n(e,t){var n=e.length;for(e.push(t);0<n;){var r=n-1>>>1,o=e[r];if(0<i(o,t))e[r]=t,e[n]=o,n=r;else break}}function r(e){return 0===e.length?null:e[0]}function o(e){if(0===e.length)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;for(var r=0,o=e.length,a=o>>>1;r<a;){var l=2*(r+1)-1,s=e[l],c=l+1,u=e[c];if(0>i(s,n))c<o&&0>i(u,s)?(e[r]=u,e[c]=n,r=c):(e[r]=s,e[l]=n,r=l);else if(c<o&&0>i(u,n))e[r]=u,e[c]=n,r=c;else break}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return 0!==n?n:e.id-t.id}if(t.unstable_now=void 0,"object"==typeof performance&&"function"==typeof performance.now){var a,l=performance;t.unstable_now=function(){return l.now()}}else{var s=Date,c=s.now();t.unstable_now=function(){return s.now()-c}}var u=[],f=[],d=1,m=null,h=3,p=!1,v=!1,b=!1,g=!1,y="function"==typeof setTimeout?setTimeout:null,w="function"==typeof clearTimeout?clearTimeout:null,E="undefined"!=typeof setImmediate?setImmediate:null;function P(e){for(var t=r(f);null!==t;){if(null===t.callback)o(f);else if(t.startTime<=e)o(f),t.sortIndex=t.expirationTime,n(u,t);else break;t=r(f)}}function x(e){if(b=!1,P(e),!v)if(null!==r(u))v=!0,T||(T=!0,a());else{var t=r(f);null!==t&&L(x,t.startTime-e)}}var T=!1,M=-1,O=5,S=-1;function j(){return!!g||!(t.unstable_now()-S<O)}function C(){if(g=!1,T){var e=t.unstable_now();S=e;var n=!0;try{e:{v=!1,b&&(b=!1,w(M),M=-1),p=!0;var i=h;try{t:{for(P(e),m=r(u);null!==m&&!(m.expirationTime>e&&j());){var l=m.callback;if("function"==typeof l){m.callback=null,h=m.priorityLevel;var s=l(m.expirationTime<=e);if(e=t.unstable_now(),"function"==typeof s){m.callback=s,P(e),n=!0;break t}m===r(u)&&o(u),P(e)}else o(u);m=r(u)}if(null!==m)n=!0;else{var c=r(f);null!==c&&L(x,c.startTime-e),n=!1}}break e}finally{m=null,h=i,p=!1}}}finally{n?a():T=!1}}}if("function"==typeof E)a=function(){E(C)};else if("undefined"!=typeof MessageChannel){var _=new MessageChannel,A=_.port2;_.port1.onmessage=C,a=function(){A.postMessage(null)}}else a=function(){y(C,0)};function L(e,n){M=y(function(){e(t.unstable_now())},n)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(e){e.callback=null},t.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):O=0<e?Math.floor(1e3/e):5},t.unstable_getCurrentPriorityLevel=function(){return h},t.unstable_next=function(e){switch(h){case 1:case 2:case 3:var t=3;break;default:t=h}var n=h;h=t;try{return e()}finally{h=n}},t.unstable_requestPaint=function(){g=!0},t.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=h;h=e;try{return t()}finally{h=n}},t.unstable_scheduleCallback=function(e,o,i){var l=t.unstable_now();switch(i="object"==typeof i&&null!==i&&"number"==typeof(i=i.delay)&&0<i?l+i:l,e){case 1:var s=-1;break;case 2:s=250;break;case 5:s=0x3fffffff;break;case 4:s=1e4;break;default:s=5e3}return s=i+s,e={id:d++,callback:o,priorityLevel:e,startTime:i,expirationTime:s,sortIndex:-1},i>l?(e.sortIndex=i,n(f,e),null===r(u)&&e===r(f)&&(b?(w(M),M=-1):b=!0,L(x,i-l))):(e.sortIndex=s,n(u,e),v||p||(v=!0,T||(T=!0,a()))),e},t.unstable_shouldYield=j,t.unstable_wrapCallback=function(e){var t=h;return function(){var n=h;h=t;try{return e.apply(this,arguments)}finally{h=n}}}},7696:(e,t,n)=>{n.d(t,{X:()=>i});var r=n(2115),o=n(264);function i({pixelated:e}){let t=(0,o.C)(e=>e.gl),n=(0,o.C)(e=>e.internal.active),i=(0,o.C)(e=>e.performance.current),a=(0,o.C)(e=>e.viewport.initialDpr),l=(0,o.C)(e=>e.setDpr);return r.useEffect(()=>{let r=t.domElement;return()=>{n&&l(a),e&&r&&(r.style.imageRendering="auto")}},[]),r.useEffect(()=>{l(i*a),e&&t.domElement&&(t.domElement.style.imageRendering=1===i?"auto":"pixelated")},[i]),null}},8381:(e,t,n)=>{n.d(t,{mK:()=>P,UN:()=>x,E8:()=>T,s0:()=>g,Tl:()=>M,fE:()=>S});var r=n(5155),o=n(2115),i=n(5339),a=n(264),l=n(3303);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}new i.I9Y,new i.I9Y;function c(e,t){if(!(e instanceof t))throw TypeError("Cannot call a class as a function")}var u=function e(t,n,r){var o=this;c(this,e),s(this,"dot2",function(e,t){return o.x*e+o.y*t}),s(this,"dot3",function(e,t,n){return o.x*e+o.y*t+o.z*n}),this.x=t,this.y=n,this.z=r},f=[new u(1,1,0),new u(-1,1,0),new u(1,-1,0),new u(-1,-1,0),new u(1,0,1),new u(-1,0,1),new u(1,0,-1),new u(-1,0,-1),new u(0,1,1),new u(0,-1,1),new u(0,1,-1),new u(0,-1,-1)],d=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],m=Array(512),h=Array(512);!function(e){e>0&&e<1&&(e*=65536),(e=Math.floor(e))<256&&(e|=e<<8);for(var t,n=0;n<256;n++)t=1&n?d[n]^255&e:d[n]^e>>8&255,m[n]=m[n+256]=t,h[n]=h[n+256]=f[t%12]}(0);function p(e){var t=function(e){if("number"==typeof e)e=Math.abs(e);else if("string"==typeof e){var t=e;e=0;for(var n=0;n<t.length;n++)e=(e+(n+1)*(t.charCodeAt(n)%96))%0x7fffffff}return 0===e&&(e=311),e}(e);return function(){var e=48271*t%0x7fffffff;return t=e,e/0x7fffffff}}new function e(t){var n=this;c(this,e),s(this,"seed",0),s(this,"init",function(e){n.seed=e,n.value=p(e)}),s(this,"value",p(this.seed)),this.init(t)}(Math.random());i.LoY;n(1948);let v=(0,o.createContext)(null),b=e=>(2&e.getAttributes())==2,g=(0,o.memo)((0,o.forwardRef)(({children:e,camera:t,scene:n,resolutionScale:s,enabled:c=!0,renderPriority:u=1,autoClear:f=!0,depthBuffer:d,enableNormalPass:m,stencilBuffer:h,multisampling:p=8,frameBufferType:g=i.ix0},y)=>{let{gl:w,scene:E,camera:P,size:x}=(0,a.C)(),T=n||E,M=t||P,[O,S,j]=(0,o.useMemo)(()=>{let e=new l.s0(w,{depthBuffer:d,stencilBuffer:h,multisampling:p,frameBufferType:g});e.addPass(new l.AH(T,M));let t=null,n=null;return m&&((n=new l.Xe(T,M)).enabled=!1,e.addPass(n),void 0!==s&&((t=new l.SP({normalBuffer:n.texture,resolutionScale:s})).enabled=!1,e.addPass(t))),[e,n,t]},[M,w,d,h,p,g,T,m,s]);(0,o.useEffect)(()=>O?.setSize(x.width,x.height),[O,x]),(0,a.D)((e,t)=>{if(c){let e=w.autoClear;w.autoClear=f,h&&!f&&w.clearStencil(),O.render(t),w.autoClear=e}},c?u:0);let C=(0,o.useRef)(null);(0,o.useLayoutEffect)(()=>{let e=[],t=C.current.__r3f;if(t&&O){let n=t.children;for(let t=0;t<n.length;t++){let r=n[t].object;if(r instanceof l.Mj){let o=[r];if(!b(r)){let e=null;for(;(e=n[t+1]?.object)instanceof l.Mj&&!b(e);)o.push(e),t++}let i=new l.Vu(M,...o);e.push(i)}else r instanceof l.oF&&e.push(r)}for(let t of e)O?.addPass(t);S&&(S.enabled=!0),j&&(j.enabled=!0)}return()=>{for(let t of e)O?.removePass(t);S&&(S.enabled=!1),j&&(j.enabled=!1)}},[O,e,M,S,j]),(0,o.useEffect)(()=>{let e=w.toneMapping;return w.toneMapping=i.y_p,()=>{w.toneMapping=e}},[w]);let _=(0,o.useMemo)(()=>({composer:O,normalPass:S,downSamplingPass:j,resolutionScale:s,camera:M,scene:T}),[O,S,j,s,M,T]);return(0,o.useImperativeHandle)(y,()=>O,[O]),(0,r.jsx)(v.Provider,{value:_,children:(0,r.jsx)("group",{ref:C,children:e})})})),y=0,w=new WeakMap,E=(e,t)=>function({blendFunction:n=t?.blendFunction,opacity:i=t?.opacity,...l}){let s=w.get(e);if(!s){let t=`@react-three/postprocessing/${e.name}-${y++}`;(0,a.e)({[t]:e}),w.set(e,s=t)}let c=(0,a.C)(e=>e.camera),u=o.useMemo(()=>[...t?.args??[],...l.args??[{...t,...l}]],[JSON.stringify(l)]);return(0,r.jsx)(s,{camera:c,"blendMode-blendFunction":n,"blendMode-opacity-value":i,...l,args:u})};l.Mj;let P=E(l.bv,{blendFunction:0}),x=E(l.lq),T=E(l.t$),M=E(l.Ql);l.i,l.hH;var O=(e=>(e[e.Linear=0]="Linear",e[e.Radial=1]="Radial",e[e.MirroredLinear=2]="MirroredLinear",e))(O||{});l.Mj;let S=E(l.K1),j=(l.To,{fragmentShader:`

    // original shader by Evan Wallace

    #define MAX_ITERATIONS 100

    uniform float blur;
    uniform float taper;
    uniform vec2 start;
    uniform vec2 end;
    uniform vec2 direction;
    uniform int samples;

    float random(vec3 scale, float seed) {
        /* use the fragment position for a different seed per-pixel */
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = vec4(0.0);
        float total = 0.0;
        vec2 startPixel = vec2(start.x * resolution.x, start.y * resolution.y);
        vec2 endPixel = vec2(end.x * resolution.x, end.y * resolution.y);
        float f_samples = float(samples);
        float half_samples = f_samples / 2.0;

        // use screen diagonal to normalize blur radii
        float maxScreenDistance = distance(vec2(0.0), resolution); // diagonal distance
        float gradientRadius = taper * (maxScreenDistance);
        float blurRadius = blur * (maxScreenDistance / 16.0);

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
        vec2 normal = normalize(vec2(startPixel.y - endPixel.y, endPixel.x - startPixel.x));
        float radius = smoothstep(0.0, 1.0, abs(dot(uv * resolution - startPixel, normal)) / gradientRadius) * blurRadius;

        #pragma unroll_loop_start
        for (int i = 0; i <= MAX_ITERATIONS; i++) {
            if (i >= samples) { break; } // return early if over sample count
            float f_i = float(i);
            float s_i = -half_samples + f_i;
            float percent = (s_i + offset - 0.5) / half_samples;
            float weight = 1.0 - abs(percent);
            vec4 sample_i = texture2D(inputBuffer, uv + normalize(direction) / resolution * percent * radius);
            /* switch to pre-multiplied alpha to correctly blur transparent images */
            sample_i.rgb *= sample_i.a;
            color += sample_i * weight;
            total += weight;
        }
        #pragma unroll_loop_end

        outputColor = color / total;

        /* switch back from pre-multiplied alpha */
        outputColor.rgb /= outputColor.a + 0.00001;
    }
    `});l.Mj;l.Mj;l.Mj},8717:(e,t,n)=>{n.d(t,{m:()=>f});var r=n(8945),o=n(2115),i=n(5339);let a=parseInt(i.sPf.replace(/\D+/g,""));var l=Object.defineProperty,s=(e,t,n)=>(((e,t,n)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,n),n);let c=(()=>{let e={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new i.Pq0},up:{value:new i.Pq0(0,1,0)}},vertexShader:`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      uniform vec3 up;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
        zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
        return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
        float c = ( 0.2 * T ) * 10E-18;
        return 0.434 * c * MieConst;
      }

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position.z = gl_Position.w; // set z to camera.far

        vSunDirection = normalize( sunPosition );

        vSunE = sunIntensity( dot( vSunDirection, up ) );

        vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

        float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
        vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
        vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,fragmentShader:`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      uniform float mieDirectionalG;
      uniform vec3 up;

      const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
        return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
        float g2 = pow( g, 2.0 );
        float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
        return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      void main() {

        vec3 direction = normalize( vWorldPosition - cameraPos );

      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
        float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
        float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
        float sR = rayleighZenithLength * inverse;
        float sM = mieZenithLength * inverse;

      // combined extinction factor
        vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
        float cosTheta = dot( direction, vSunDirection );

        float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
        vec3 betaRTheta = vBetaR * rPhase;

        float mPhase = hgPhase( cosTheta, mieDirectionalG );
        vec3 betaMTheta = vBetaM * mPhase;

        vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
        Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
        float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
        float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
        vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
        vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
        float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
        L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

        vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

        vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

        gl_FragColor = vec4( retColor, 1.0 );

      #include <tonemapping_fragment>
      #include <${a>=154?"colorspace_fragment":"encodings_fragment"}>

      }
    `},t=new i.BKk({name:"SkyShader",fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:i.LlO.clone(e.uniforms),side:i.hsX,depthWrite:!1});class n extends i.eaF{constructor(){super(new i.iNn(1,1,1),t)}}return s(n,"SkyShader",e),s(n,"material",t),n})();function u(e,t,n=new i.Pq0){let r=Math.PI*(e-.5),o=2*Math.PI*(t-.5);return n.x=Math.cos(o),n.y=Math.sin(r),n.z=Math.sin(o),n}let f=o.forwardRef(({inclination:e=.6,azimuth:t=.1,distance:n=1e3,mieCoefficient:a=.005,mieDirectionalG:l=.8,rayleigh:s=.5,turbidity:f=10,sunPosition:d=u(e,t),...m},h)=>{let p=o.useMemo(()=>new i.Pq0().setScalar(n),[n]),[v]=o.useState(()=>new c);return o.createElement("primitive",(0,r.A)({object:v,ref:h,"material-uniforms-mieCoefficient-value":a,"material-uniforms-mieDirectionalG-value":l,"material-uniforms-rayleigh-value":s,"material-uniforms-sunPosition-value":d,"material-uniforms-turbidity-value":f,scale:p},m))})},8828:(e,t,n)=>{e.exports=n(3654)},8945:(e,t,n)=>{n.d(t,{A:()=>r});function r(){return(r=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(null,arguments)}},9914:(e,t,n)=>{e.exports=n(6451)}}]);