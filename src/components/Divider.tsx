import type { DetailedHTMLProps, HTMLAttributes } from 'react';

export const Divider = ({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>) => {
  return (
    <div
      className={`${className} overflow-hidden leading-0 h-[1px]`}
      {...props}
    >
      --------------------------------------------------------------------------------------------------
    </div>
  );
};
