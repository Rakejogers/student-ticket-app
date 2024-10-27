"use client";

import { useEffect, useState } from "react";
import isAuth from "../../../components/isAuth";
import pb from "@/app/pocketbase";

const SettingsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
          <h1 className="text-4xl font-bold text-center mb-8">My Tickets</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          </div>
        </div>
      );
};

export default isAuth(SettingsPage);