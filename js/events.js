const events = (function () {
  const events = {};
  const on = function (eventName, EventHandler) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(EventHandler);
  };

  const off = function (eventName, EventHandler) {
    if (events[eventName]) {
      events[eventName].filter((fn) => fn != EventHandler);
    }
  };

  const emit = function (eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach((fnHandler) => fnHandler(data));
    }
  };

  return { on, off, emit };
})();
