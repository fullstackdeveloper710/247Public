import React from "react";

const PlanCard = ({ plans, onKeyDown, className, onChange }) => {
  return (
    <fieldset
      className={
        className ? `subscriptionPlan ${className}` : "subscriptionPlan"
      }
      onKeyDown={onKeyDown}
    >
      <legend>Subscription plan</legend>

      <div className="subscriptionPlanBox">
        {plans.map(
          (
            {
              checked,
              disabled,
              id,
              name,
              value,
              legend,
              cardHeading,
              commingSoon,
              planPrice,
              duration,
              contactUsLink,
              current,
              ckeckIcon,
              ConactUsBtn,
            },
            index
          ) => {
            return (
              <div key={index} className="subscriptionPlanBoxCol">
                <input
                  disabled={disabled}
                  type="radio"
                  id={id}
                  name={name}
                  value={value}
                  checked={checked}
                  onChange={onChange}
                />
                <label htmlFor={id} className="subscriptionPlan__inner">
                  {ckeckIcon && <span className="activePln" role="img" />}
                  <span className="subscriptionPlan__header">
                    {current && (
                      <span
                        className="cs__badge"
                        role="img"
                        aria-label={checked ? "Selected Plan" : null}
                      >
                        Current Plan
                      </span>
                    )}
                    <span className="subscriptionPlan__header_heading">
                      {legend}
                    </span>
                    {!commingSoon && (
                      <span className="subscriptionPlan__header_text">
                        {cardHeading}
                      </span>
                    )}
                    {commingSoon && <span className="subscriptionPlan__header_text">Unlimited users</span>}
                  </span>
                  <span className="subscriptionPlan__content">
                    {!commingSoon && (
                      <span className="bigtext">{planPrice}</span>
                    )}
                    {!commingSoon && <span>{duration}</span>}
                    {contactUsLink && (
                      <a
                        role="button"
                        target="_blank"
                        className="btn btn--md button--blue ms-3"
                        href={contactUsLink}
                      >
                        Contact us
                      </a>
                    )}
                    {ConactUsBtn && ConactUsBtn}
                  </span>
                </label>
              </div>
            );
          }
        )}
      </div>
    </fieldset>
  );
};

export default PlanCard;
