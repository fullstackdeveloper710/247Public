import React, { useEffect } from "react";
import dropin from "braintree-web-drop-in";

export default function BraintreeDropIn({
  braintreeToken,
  setBraintreeInstance,
  braintreeInstance,
}) {
  useEffect(() => {
    if (braintreeToken) {
      const initializeBraintree = () =>
        dropin.create(
          {
            // insert your tokenization key or client token here
            authorization: braintreeToken,
            container: "#braintree-drop-in-div",
            // vaultManager: true,
            card: {
              cardholderName: true,
              overrides: {
                fields: {
                  cardholderName: {
                    selector: "#cc-name",
                    placeholder: "Card Holder",
                  },
                  number: {
                    placeholder: "4111 1111 1111 1111",
                    maskInput: true,
                  },
                  cvv: {
                    minlength: 3,
                    maxlength: 3,
                    placeholder: "123",
                    maskInput: true, // Set the minimum length of the postal code field
                  },
                  // Remove the CVV field from your form
                },
                styles: {
                  input: {
                    // Change the font size for all inputs
                    fontSize: "1rem",
                  },
                  ":focus": {
                    color: "black", // Change the focus color to red for all inputs
                  },
                  ".valid": {
                    color: "green",
                  },
                  ".invalid": {
                    color: "red",
                  },
                },
              },
            },
          },
          function (error, instance) {
            if (error) console.error(error);
            else setBraintreeInstance(instance);
          }
        );

      if (braintreeInstance) {
        braintreeInstance.teardown().then(() => {
          initializeBraintree();
        });
      } else {
        initializeBraintree();
      }
    }
  }, [braintreeToken]);

  if (!braintreeToken) {
    return <div>loading...</div>;
  } else {
    return (
      <div>
        <div id="braintree-drop-in-div" />
        <div className="w-100 d-flex justify-content-end"></div>
      </div>
    );
  }
}
