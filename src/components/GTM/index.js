import { useEffect } from "react";

function GTMScript({ containerId }) {
  useEffect(() => {
    // GTM script
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "GTM-T8VDCRD");

    // Add the first script tag to the document
    const script1 = document.createElement("script");
    script1.innerHTML = `
     window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({ 'event' : 'login' });
   `;

    document.head.appendChild(script1);
    // Cleanup function to remove the script when the component unmounts
    return () => {
      // Replace 'GTM-T8VDCRD' with your actual GTM Container ID
      const scriptToRemove = document.querySelector(
        `script[src^="https://www.googletagmanager.com/gtm.js?id=GTM-T8VDCRD"]`
      );

      if (scriptToRemove) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
      if (script1) {
        document.head.removeChild(script1);
      }
    };
  }, []);

  return null;
}

export default GTMScript;
