import type { ComponentProps } from "react";

type Props = ComponentProps<"textarea">;

const TextArea = (props: Props) => {
  return <textarea {...props} className="p-4 border border-gray-300 w-full" />;
};

export default TextArea;
