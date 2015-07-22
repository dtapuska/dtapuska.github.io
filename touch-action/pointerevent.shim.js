var MOUSE_PROPS = [
  'bubbles',
  'cancelable',
  'view',
  'detail',
  'screenX',
  'screenY',
  'clientX',
  'clientY',
  'ctrlKey',
  'altKey',
  'shiftKey',
  'metaKey',
  'button',
  'relatedTarget',
  'pageX',
  'pageY'
];

var MOUSE_DEFAULTS = [
  false,
  false,
  null,
  null,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null,
  0,
  0
];

function toPointerEvent(inType, inDict) {
  inDict = inDict || Object.create(null);

  var e = document.createEvent('Event');
  e.initEvent(inType, inDict.bubbles || false, inDict.cancelable || false);

  // define inherited MouseEvent properties
  // skip bubbles and cancelable since they're set above in initEvent()
  for (var i = 2, p; i < MOUSE_PROPS.length; i++) {
    p = MOUSE_PROPS[i];
    e[p] = inDict[p] || MOUSE_DEFAULTS[i];
  }
  e.buttons = inDict.buttons || 0;

  e.clientX = inDict.touches[0].pageX;
  e.clientY = inDict.touches[0].pageX;

  // Spec requires that pointers without pressure specified use 0.5 for down
  // state and 0 for up state.
  var pressure = 0;
  if (inDict.pressure) {
    pressure = inDict.pressure;
  } else {
    pressure = e.buttons ? 0.5 : 0;
  }

  // add x/y properties aliased to clientX/Y
  e.x = e.clientX;
  e.y = e.clientY;

  // define the properties of the PointerEvent interface
  e.pointerId = inDict.pointerId || 0;
  e.width = inDict.width || 0;
  e.height = inDict.height || 0;
  e.pressure = pressure;
  e.tiltX = inDict.tiltX || 0;
  e.tiltY = inDict.tiltY || 0;
  e.pointerType = inDict.pointerType || '';
  e.hwTimestamp = inDict.hwTimestamp || 0;
  e.isPrimary = inDict.isPrimary || false;
  return e;
}


if (!window.PointerEvent) {
    var super_add_event_listener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function(type, listener, capture) {
      if (type === 'pointerdown') {
          console.log("add pointer down");
        super_add_event_listener("touchstart", function(e) {
                                                 listener(toPointerEvent(type, e));
                                               });
      } else if (type === 'pointermove') {
        super_add_event_listener("touchmove", function(e) {
                                                 listener(toPointerEvent(type, e));
                                               });
      } else if (type === 'pointerup') {
        super_add_event_listener("touchend", function(e) {
                                                 listener(toPointerEvent(type, e));
                                               });
      } else {
        super_add_event_listener(type, listener, capture);
      }
    }
}
