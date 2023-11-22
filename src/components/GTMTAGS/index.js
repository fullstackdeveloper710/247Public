import GTMScript from "components/GTM";
import React, { useEffect } from "react";
// import { Helmet } from "react-helmet";

const GTMTAGS = () => {
  useEffect(() => {
    // Create a new iFrame element
    const iFrame = document.createElement("iframe");

    // Set some attributes for the iFrame
    iFrame.setAttribute(
      "src",
      "https://www.googletagmanager.com/ns.html?id=GTM-T8VDCRD"
    );
    iFrame.setAttribute("height", "0");
    iFrame.setAttribute("width", "0");
    iFrame.setAttribute("style", "display:none;visibility:hidden");

    // get element from html with its id
    const noScriptEl = document.getElementById("noscript_root");
    noScriptEl.innerText = "";
    noScriptEl.appendChild(iFrame);

    // Clean up and change conteent of the noscript when the component unmounts
    return () => {
      noScriptEl.removeChild(iFrame);
      noScriptEl.innerText = "You need to enable JavaScript to run this app.";
    };
  }, []);

  return <GTMScript />;
};

export default GTMTAGS;

// <Helmet>
//   {/* <!-- Google Tag Manager --> */}
//   <script>
//     {`(
//       {function (w, d, s, l, i) {
//         w[l] = w[l] || [];
//         w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
//         var f = d.getElementsByTagName(s)[0],
//           j = d.createElement(s),
//           dl = l != "dataLayer" ? "&l=" + l : "";
//         j.async = true;
//         j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
//         f.parentNode.insertBefore(j, f);
//       }}
//       )(window,document,'script','dataLayer','GTM-T8VDCRD');`}
//   </script>
//   {/* <!-- End Google Tag Manager --> */}
// </Helmet>
