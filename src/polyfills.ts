// https://www.npmjs.com/package/react-app-polyfill#polyfilling-other-language-features
import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

// https://www.npmjs.com/package/react-intersection-observer#polyfill
if (typeof window.IntersectionObserver === "undefined") {
  import("intersection-observer");
}
