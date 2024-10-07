"use client";

import isAuth from "../../../components/isAuth";

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings</h1>
    </div>
  );
};

export default isAuth(SettingsPage);