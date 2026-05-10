type Props = {
  message: string;
};

const ErrorMessage = (props: Props) => {
  if (props.message) {
    return <p>{props.message}</p>;
  }
};

export default ErrorMessage;
