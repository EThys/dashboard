import { isVNode } from 'vue';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
let toastsCounter = 1;
var Observer = class {
  constructor() {
    __publicField(this, "subscribers");
    __publicField(this, "toasts");
    __publicField(this, "dismissedToasts");
    __publicField(this, "subscribe", (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    });
    __publicField(this, "publish", (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    });
    __publicField(this, "addToast", (data) => {
      this.publish(data);
      this.toasts = [...this.toasts, data];
    });
    __publicField(this, "create", (data) => {
      var _a;
      const { message, ...rest } = data;
      const id = typeof data.id === "number" || data.id && ((_a = data.id) == null ? void 0 : _a.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast$1) => {
        return toast$1.id === id;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) this.dismissedToasts.delete(id);
      if (alreadyExists) this.toasts = this.toasts.map((toast$1) => {
        if (toast$1.id === id) {
          this.publish({
            ...toast$1,
            ...data,
            id,
            title: message
          });
          return {
            ...toast$1,
            ...data,
            id,
            dismissible,
            title: message
          };
        }
        return toast$1;
      });
      else this.addToast({
        title: message,
        ...rest,
        dismissible,
        id
      });
      return id;
    });
    __publicField(this, "dismiss", (id) => {
      if (id) {
        this.dismissedToasts.add(id);
        requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
          id,
          dismiss: true
        })));
      } else this.toasts.forEach((toast$1) => {
        this.subscribers.forEach((subscriber) => subscriber({
          id: toast$1.id,
          dismiss: true
        }));
      });
      return id;
    });
    __publicField(this, "message", (message, data) => {
      return this.create({
        ...data,
        message,
        type: "default"
      });
    });
    __publicField(this, "error", (message, data) => {
      return this.create({
        ...data,
        type: "error",
        message
      });
    });
    __publicField(this, "success", (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message
      });
    });
    __publicField(this, "info", (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message
      });
    });
    __publicField(this, "warning", (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message
      });
    });
    __publicField(this, "loading", (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message
      });
    });
    __publicField(this, "promise", (promise, data) => {
      if (!data) return;
      let id;
      if (data.loading !== void 0) id = this.create({
        ...data,
        promise,
        type: "loading",
        message: data.loading,
        description: typeof data.description !== "function" ? data.description : void 0
      });
      const p = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id !== void 0;
      let result;
      const originalPromise = p.then(async (response) => {
        result = ["resolve", response];
        const isVueComponent = isVNode(response);
        if (isVueComponent) {
          shouldDismiss = false;
          this.create({
            id,
            type: "default",
            message: response
          });
        } else if (isHttpResponse(response) && !response.ok) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
          const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !isVNode(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData || "",
            id: id || ""
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (response instanceof Error) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !isVNode(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData || "",
            id: id || ""
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !isVNode(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData || "",
            id: id || ""
          };
          this.create({
            id,
            type: "success",
            description,
            ...toastSettings
          });
        }
      }).catch(async (error) => {
        result = ["reject", error];
        if (data.error !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
          const description = typeof data.description === "function" ? await data.description(error) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !isVNode(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData || "",
            id: id || ""
          };
          this.create({
            id,
            type: "error",
            description,
            ...toastSettings
          });
        }
      }).finally(() => {
        var _a;
        if (shouldDismiss) {
          this.dismiss(id);
          id = void 0;
        }
        (_a = data.finally) == null ? void 0 : _a.call(data);
      });
      const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
      if (typeof id !== "string" && typeof id !== "number") return { unwrap };
      else return Object.assign(id, { unwrap });
    });
    __publicField(this, "custom", (component, data) => {
      const id = (data == null ? void 0 : data.id) || toastsCounter++;
      const alreadyExists = this.toasts.find((toast$1) => {
        return toast$1.id === id;
      });
      const dismissible = (data == null ? void 0 : data.dismissible) === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id)) this.dismissedToasts.delete(id);
      if (alreadyExists) this.toasts = this.toasts.map((toast$1) => {
        if (toast$1.id === id) {
          this.publish({
            ...toast$1,
            component,
            dismissible,
            id,
            ...data
          });
          return {
            ...toast$1,
            component,
            dismissible,
            id,
            ...data
          };
        }
        return toast$1;
      });
      else this.addToast({
        component,
        dismissible,
        id,
        ...data
      });
      return id;
    });
    __publicField(this, "getActiveToasts", () => {
      return this.toasts.filter((toast$1) => !this.dismissedToasts.has(toast$1.id));
    });
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = /* @__PURE__ */ new Set();
  }
};
const ToastState = new Observer();
function toastFunction(message, data) {
  const id = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.create({
    message,
    id,
    type: "default",
    ...data
  });
  return id;
}
const isHttpResponse = (data) => {
  return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
const toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
}, {
  getHistory,
  getToasts
});

export { toast as t };
//# sourceMappingURL=index-DJGQOf1Z.mjs.map
