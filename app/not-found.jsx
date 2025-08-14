import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-600">
          Oops! Page not found
        </h2>
        <p className="mt-2 text-gray-500">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-4">
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>

        </div>
      </div>
    </div>
  );
};

export default NotFound;
