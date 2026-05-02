"use client";

import dynamic from "next/dynamic";

const AdminContent = dynamic(() => import("./AdminContent"), { ssr: false });

export default AdminContent;
