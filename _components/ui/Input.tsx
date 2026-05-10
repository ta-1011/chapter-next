import type { ComponentProps } from "react";

type Props = ComponentProps<"input">;

const Input = (props: Props) => {
  return <input {...props} className="p-4 border border-gray-300 w-full" />;
};

export default Input;
