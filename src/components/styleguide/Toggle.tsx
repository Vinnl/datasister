import React from 'react';

interface OwnProps {
  label: string;
};

type Props = Omit<React.HTMLAttributes<HTMLInputElement>, keyof OwnProps> & OwnProps;

/**
 * @param props Attributes that are valid for `<input type="checkbox">` are valid here too. Additionally, a `label` prop is required. This is currently only provided to screen readers, but will likely be shown in the interface later.
 */
export const Toggle: React.FC<Props> = (props) => {
  const inputProps = {
    ...props,
    label: undefined,
  };

  return (
    <label className="switch">
      <input {...inputProps} aria-label={props.label} type="checkbox"/>
      <span className="slider round"/>
    </label>
  );
}
