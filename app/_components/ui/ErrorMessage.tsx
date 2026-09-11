// バリデーションエラーが無いとき（正しく入力できているとき）はそもそもエラーが不要なため、？がいる
type Props = {
  message?: string;
};

const ErrorMessage = (props: Props) => {
  if (!props.message) return;

  if (props.message) {
    return <p>{props.message}</p>;
  }
};

export default ErrorMessage;
