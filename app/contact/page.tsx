"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import TextArea from "@/components/ui/TextArea";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [messageErrorMessage, setMessageErrorMessage] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);

  const valid = () => {
    let isValid = true;
    let nameError = "";
    let emailError = "";
    let messageError = "";

    if (!name) {
      nameError = "お名前を入力してください";
      isValid = false;
    }
    if (!email) {
      emailError = "メールアドレスを入力してください";
      isValid = false;
    }
    if (!message) {
      messageError = "本文は必須です";
      isValid = false;
    }

    setNameErrorMessage(nameError);
    setEmailErrorMessage(emailError);
    setMessageErrorMessage(messageError);

    //最後はどちらの真偽地になっても、isValidのリターン式が必要
    return isValid;
  };

  //送信の処理
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!valid()) return;
    setIsSubmit(true);

    try {
      await fetch(`${API_BASE_URL}/contacts`);
      alert("送信しました。");
      handleClear();
    } catch (error) {
      alert("送信に失敗しました");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <div className="max-w-200 mx-auto py-10">
        <h1 className="text-left text-4xl">記事一覧</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-8 w-full flex justify-between">
            <label htmlFor="" className="w-60">
              お名前
            </label>
            <div className="w-full">
              <Input
                type="text"
                value={name}
                id="name"
                onChange={(e) => setName(e.target.value)}
              />
              <ErrorMessage message={nameErrorMessage} />
            </div>
          </div>
          <div className="mt-8 w-full flex justify-between">
            <label htmlFor="" className="w-60">
              メールアドレス
            </label>
            <div className="w-full">
              <Input
                type="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <ErrorMessage message={emailErrorMessage} />
            </div>
          </div>
          <div className="mt-8 w-full flex justify-between">
            <label htmlFor="" className="w-60">
              お問い合わせ内容
            </label>
            <div className="w-full">
              <TextArea
                value={message}
                id="message"
                onChange={(e) => setMessage(e.target.value)}
              />
              <ErrorMessage message={messageErrorMessage} />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" className="mr-4" disabled={isSubmit}>
              送信
            </button>
            <button type="button" onClick={handleClear} disabled={isSubmit}>
              クリア
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Contact;
