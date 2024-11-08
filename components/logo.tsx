"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import pb from "@/app/pocketbase";

export function Logo({ isAuthenticated }: { isAuthenticated: boolean }) {
    const [logoLink, setLogoLink] = useState("")

    useEffect (() => {
        const newlogolink = pb.authStore.isValid ? "/browse/events" : "/";
        setLogoLink(newlogolink);
    }
    , []);
    
    return (
        <Link href={logoLink} className="text-2xl font-bold text-primary">
            Scholar Seats
        </Link>
    );
}