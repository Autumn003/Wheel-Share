import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center">
      <h1 className="text-4xl font-semibold text-primary mb-4">
        Something Went Wrong
      </h1>
      <p className="text-lg text-secondary mb-8">
        We encountered an unexpected error. Please try again later.
      </p>
      <Button onClick={handleGoBack}>Back to Home</Button>
    </div>
  );
};

export default ErrorPage;
